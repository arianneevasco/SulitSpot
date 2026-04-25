// functions/src/index.ts
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule }                           from 'firebase-functions/v2/scheduler';
import { initializeApp }                        from 'firebase-admin/app';
import { getFirestore, FieldValue }             from 'firebase-admin/firestore';
import * as crypto                              from 'crypto';

// Cloudinary credentials loaded from functions/.env
const CLOUDINARY_CLOUD_NAME = { value: () => process.env.CLOUDINARY_CLOUD_NAME ?? '' };
const CLOUDINARY_API_KEY    = { value: () => process.env.CLOUDINARY_API_KEY    ?? '' };
const CLOUDINARY_API_SECRET = { value: () => process.env.CLOUDINARY_API_SECRET ?? '' };
// Claude key — never expose this to the client
const CLAUDE_API_KEY        = { value: () => process.env.CLAUDE_API_KEY        ?? '' };

import { onCall, HttpsError } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();

const REPORT_THRESHOLD = 5;
const OUTDATED_DAYS    = 7;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface PushData {
  type:      'POST_HIDDEN' | 'POST_OUTDATED';
  postId:    string;
  postTitle: string;
}

interface NotifyPayload {
  userId: string;
  title:  string;
  postId: string;
}

interface FirestorePost {
  userId:      string;
  title:       string;
  reportCount: number;
  isHidden:    boolean;
  isArchived:  boolean;
  isOutdated:  boolean;
  photoURL:    string | null;
  createdAt:   { toDate: () => Date } | null;
}

interface CloudinaryResult {
  result: 'ok' | 'not found' | string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Send push via Expo Push API
// ─────────────────────────────────────────────────────────────────────────────
const sendPushToUser = async (
  userId: string,
  title:  string,
  body:   string,
  data:   Partial<PushData> = {}
): Promise<void> => {
  try {
    const userSnap = await db.collection('users').doc(userId).get();
    if (!userSnap.exists) return;

    const fcmToken = userSnap.data()?.fcmToken as string | undefined;
    if (!fcmToken || !fcmToken.startsWith('ExponentPushToken')) return;

    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method:  'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to:    fcmToken,
        title,
        body,
        data: {
          postId:    String(data.postId    ?? ''),
          postTitle: String(data.postTitle ?? ''),
          type:      String(data.type      ?? ''),
        },
        sound: 'default',
        badge: 1,
      }),
    });

    const result = await res.json();
    console.log(`[Push] Sent to user ${userId}:`, JSON.stringify(result));
  } catch (err: unknown) {
    console.warn(
      `[Push] Failed for user ${userId}:`,
      err instanceof Error ? err.message : String(err)
    );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 1: onReportCreated
// ─────────────────────────────────────────────────────────────────────────────
export const onReportCreated = onDocumentCreated(
  'reports/{reportId}',
  async (event) => {
    const reportData = event.data?.data() as { postId?: string } | undefined;
    const postId     = reportData?.postId;

    if (!postId) {
      console.warn('[onReportCreated] Missing postId');
      return;
    }

    const postRef                           = db.collection('posts').doc(postId);
    let   notifyPayload: NotifyPayload | null = null;

    try {
      await db.runTransaction(async (tx) => {
        const postSnap = await tx.get(postRef);
        if (!postSnap.exists) {
          console.warn(`[onReportCreated] Post ${postId} not found`);
          return;
        }

        const post     = postSnap.data() as FirestorePost;
        const newCount = (post.reportCount || 0) + 1;

        tx.update(postRef, {
          reportCount: newCount,
          updatedAt:   FieldValue.serverTimestamp(),
        });

        if (newCount >= REPORT_THRESHOLD && !post.isHidden) {
          tx.update(postRef, { isHidden: true });
          console.log(`[onReportCreated] Post ${postId} hidden — reportCount: ${newCount}`);

          notifyPayload = {
            userId: post.userId,
            title:  post.title,
            postId,
          };
        }
      });
    } catch (err: unknown) {
      console.error(
        '[onReportCreated] Transaction failed:',
        err instanceof Error ? err.message : String(err)
      );
      return;
    }

    // notifyPayload is set inside the transaction only if threshold was crossed
    if (notifyPayload !== null) {
      const payload = notifyPayload as NotifyPayload;
      await sendPushToUser(
        payload.userId,
        'Your post was flagged',
        `"${payload.title}" has been hidden after multiple community reports.`,
        { type: 'POST_HIDDEN', postId: payload.postId, postTitle: payload.title }
      );
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 2: checkOutdated
// ─────────────────────────────────────────────────────────────────────────────
export const checkOutdated = onSchedule(
  {
    schedule: '0 16 * * *',
    timeZone: 'Asia/Manila',
  },
  async () => {
    const cutoff = new Date(Date.now() - OUTDATED_DAYS * 24 * 60 * 60 * 1000);

    // Filter by createdAt in the query — lets Firestore do the work instead of
    // fetching every active post and filtering in JavaScript (expensive at scale).
    // Requires a composite index: isArchived + isHidden + isOutdated + createdAt asc
    const snapshot = await db.collection('posts')
      .where('isArchived', '==', false)
      .where('isHidden',   '==', false)
      .where('isOutdated', '==', false)
      .where('createdAt',  '<',  cutoff)
      .get();

    const batch           = db.batch();
    const notifyPromises: Promise<void>[] = [];
    let   taggedCount     = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as FirestorePost;

      // Firestore query already filtered by createdAt < cutoff,
      // so every doc here is outdated — no JS date check needed.
      batch.update(docSnap.ref, {
        isOutdated: true,
        updatedAt:  FieldValue.serverTimestamp(),
      });
      taggedCount++;

      notifyPromises.push(
        sendPushToUser(
          data.userId,
          'Is your post still accurate?',
          `"${data.title}" is ${OUTDATED_DAYS}+ days old. Confirm it's still correct or archive it.`,
          { type: 'POST_OUTDATED', postId: docSnap.id, postTitle: data.title }
        )
      );
    });

    if (taggedCount > 0) {
      await batch.commit();
      await Promise.allSettled(notifyPromises);
      console.log(`[checkOutdated] Tagged ${taggedCount} posts`);
    } else {
      console.log('[checkOutdated] No outdated posts today');
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 3: onPostArchived
// ─────────────────────────────────────────────────────────────────────────────
export const onPostArchived = onDocumentUpdated(
  'posts/{postId}',
  async (event) => {
    const before = event.data?.before.data() as FirestorePost | undefined;
    const after  = event.data?.after.data()  as FirestorePost | undefined;

    if (!before || !after) return;
    if (before.isArchived === after.isArchived) return;
    if (!after.isArchived) return;

    const photoURL = after.photoURL;
    if (!photoURL) {
      console.log(`[onPostArchived] Post ${event.params.postId} has no photo.`);
      return;
    }

    // Extract Cloudinary public_id from URL
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{ver}/{public_id}.{ext}
    const uploadMarker = '/upload/';
    const uploadIndex  = photoURL.indexOf(uploadMarker);
    if (uploadIndex === -1) {
      console.warn(`[onPostArchived] Not a Cloudinary URL: ${photoURL}`);
      return;
    }

    let afterUpload = photoURL.slice(uploadIndex + uploadMarker.length);
    afterUpload     = afterUpload.replace(/^v\d+\//, '');
    const publicId  = afterUpload.replace(/\.[^.]+$/, '');  // ← always assigned, no try/catch needed

    if (!publicId) {
      console.warn(`[onPostArchived] Could not extract public_id from: ${photoURL}`);
      return;
    }

    console.log(`[onPostArchived] Deleting Cloudinary asset: ${publicId}`);

    try {
      const cloudName = CLOUDINARY_CLOUD_NAME.value();
      const apiKey    = CLOUDINARY_API_KEY.value();
      const apiSecret = CLOUDINARY_API_SECRET.value();

      const timestamp = Math.floor(Date.now() / 1000);
      const toSign    = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');

      const body = new URLSearchParams({
        public_id: publicId,
        timestamp: String(timestamp),
        api_key:   apiKey,
        signature,
      });

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    body.toString(),
        }
      );

      const result = await res.json() as CloudinaryResult;

      if (result.result === 'ok') {
        console.log(`[onPostArchived] Deleted ${publicId}`);
      } else if (result.result === 'not found') {
        console.log(`[onPostArchived] Asset ${publicId} already deleted.`);
      } else {
        console.warn(`[onPostArchived] Unexpected response for ${publicId}:`, result);
      }
    } catch (err: unknown) {
      console.warn(
        `[onPostArchived] Cloudinary delete failed for ${publicId}:`,
        err instanceof Error ? err.message : String(err)
      );
    }
  }
);
// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 4: suggestCategory (HTTPS Callable)
//
// Replaces the client-side Claude API call in aiService.ts.
// The API key lives only in functions/.env — never shipped in the app bundle.
//
// Client usage (aiService.ts):
//   const fn = httpsCallable(functions, 'suggestCategory');
//   const { data } = await fn({ title });
//   // data.category → 'Food' | 'Item' | 'Tip' | null
//
// Requires auth — unauthenticated calls are rejected to prevent API abuse.
// ─────────────────────────────────────────────────────────────────────────────
const VALID_CATEGORIES = ['Food', 'Item', 'Tip'];

export const suggestCategory = onCall(
  { enforceAppCheck: false }, // set true if you enable App Check later
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required.');
    }

    const title = (request.data?.title as string | undefined)?.trim() ?? '';
    if (!title || title.length < 3) {
      return { category: null };
    }

    const apiKey = CLAUDE_API_KEY.value();
    if (!apiKey) {
      console.warn('[suggestCategory] CLAUDE_API_KEY not set in functions/.env');
      return { category: null };
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-haiku-4-5-20251001',
          max_tokens: 10,
          messages: [
            {
              role:    'user',
              content: `You are a category classifier for a Filipino campus budget-finds app called Sulit Spot.

Categories:
- Food  → food, drinks, snacks, meals, canteen, turo-turo, eateries, restaurants
- Item  → school supplies, products, goods, merchandise, secondhand items, gadgets, clothes
- Tip   → money-saving advice, discount strategies, promos, coupons, hacks, general tips

Post title: "${title}"

Reply with ONLY one word — no punctuation, no explanation: Food, Item, or Tip.`,
            },
          ],
        }),
      });

      if (!res.ok) {
        console.warn(`[suggestCategory] Claude API error: ${res.status}`);
        return { category: null };
      }

      const data     = await res.json();
      const raw      = (data?.content?.[0]?.text ?? '').trim();
      const category = VALID_CATEGORIES.find(
        (c) => c.toLowerCase() === raw.toLowerCase()
      ) ?? null;

      return { category };
    } catch (err: unknown) {
      console.warn(
        '[suggestCategory] Fetch failed:',
        err instanceof Error ? err.message : String(err)
      );
      return { category: null };
    }
  }
);