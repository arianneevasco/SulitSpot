"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestCategory = exports.onPostArchived = exports.checkOutdated = exports.onReportCreated = void 0;
// functions/src/index.ts
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const crypto = __importStar(require("crypto"));
// Cloudinary credentials loaded from functions/.env
const CLOUDINARY_CLOUD_NAME = { value: () => { var _a; return (_a = process.env.CLOUDINARY_CLOUD_NAME) !== null && _a !== void 0 ? _a : ''; } };
const CLOUDINARY_API_KEY = { value: () => { var _a; return (_a = process.env.CLOUDINARY_API_KEY) !== null && _a !== void 0 ? _a : ''; } };
const CLOUDINARY_API_SECRET = { value: () => { var _a; return (_a = process.env.CLOUDINARY_API_SECRET) !== null && _a !== void 0 ? _a : ''; } };
// Claude key — never expose this to the client
const CLAUDE_API_KEY = { value: () => { var _a; return (_a = process.env.CLAUDE_API_KEY) !== null && _a !== void 0 ? _a : ''; } };
const https_1 = require("firebase-functions/v2/https");
(0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
const REPORT_THRESHOLD = 5;
const OUTDATED_DAYS = 7;
// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Send push via Expo Push API
// ─────────────────────────────────────────────────────────────────────────────
const sendPushToUser = async (userId, title, body, data = {}) => {
    var _a, _b, _c, _d;
    try {
        const userSnap = await db.collection('users').doc(userId).get();
        if (!userSnap.exists)
            return;
        const fcmToken = (_a = userSnap.data()) === null || _a === void 0 ? void 0 : _a.fcmToken;
        if (!fcmToken || !fcmToken.startsWith('ExponentPushToken'))
            return;
        const res = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: fcmToken,
                title,
                body,
                data: {
                    postId: String((_b = data.postId) !== null && _b !== void 0 ? _b : ''),
                    postTitle: String((_c = data.postTitle) !== null && _c !== void 0 ? _c : ''),
                    type: String((_d = data.type) !== null && _d !== void 0 ? _d : ''),
                },
                sound: 'default',
                badge: 1,
            }),
        });
        const result = await res.json();
        console.log(`[Push] Sent to user ${userId}:`, JSON.stringify(result));
    }
    catch (err) {
        console.warn(`[Push] Failed for user ${userId}:`, err instanceof Error ? err.message : String(err));
    }
};
// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 1: onReportCreated
// ─────────────────────────────────────────────────────────────────────────────
exports.onReportCreated = (0, firestore_1.onDocumentCreated)('reports/{reportId}', async (event) => {
    var _a;
    const reportData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    const postId = reportData === null || reportData === void 0 ? void 0 : reportData.postId;
    if (!postId) {
        console.warn('[onReportCreated] Missing postId');
        return;
    }
    const postRef = db.collection('posts').doc(postId);
    let notifyPayload = null;
    try {
        await db.runTransaction(async (tx) => {
            const postSnap = await tx.get(postRef);
            if (!postSnap.exists) {
                console.warn(`[onReportCreated] Post ${postId} not found`);
                return;
            }
            const post = postSnap.data();
            const newCount = (post.reportCount || 0) + 1;
            tx.update(postRef, {
                reportCount: newCount,
                updatedAt: firestore_2.FieldValue.serverTimestamp(),
            });
            if (newCount >= REPORT_THRESHOLD && !post.isHidden) {
                tx.update(postRef, { isHidden: true });
                console.log(`[onReportCreated] Post ${postId} hidden — reportCount: ${newCount}`);
                notifyPayload = {
                    userId: post.userId,
                    title: post.title,
                    postId,
                };
            }
        });
    }
    catch (err) {
        console.error('[onReportCreated] Transaction failed:', err instanceof Error ? err.message : String(err));
        return;
    }
    // notifyPayload is set inside the transaction only if threshold was crossed
    if (notifyPayload !== null) {
        const payload = notifyPayload;
        await sendPushToUser(payload.userId, 'Your post was flagged', `"${payload.title}" has been hidden after multiple community reports.`, { type: 'POST_HIDDEN', postId: payload.postId, postTitle: payload.title });
    }
});
// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 2: checkOutdated
// ─────────────────────────────────────────────────────────────────────────────
exports.checkOutdated = (0, scheduler_1.onSchedule)({
    schedule: '0 16 * * *',
    timeZone: 'Asia/Manila',
}, async () => {
    const cutoff = new Date(Date.now() - OUTDATED_DAYS * 24 * 60 * 60 * 1000);
    // Filter by createdAt in the query — lets Firestore do the work instead of
    // fetching every active post and filtering in JavaScript (expensive at scale).
    // Requires a composite index: isArchived + isHidden + isOutdated + createdAt asc
    const snapshot = await db.collection('posts')
        .where('isArchived', '==', false)
        .where('isHidden', '==', false)
        .where('isOutdated', '==', false)
        .where('createdAt', '<', cutoff)
        .get();
    const batch = db.batch();
    const notifyPromises = [];
    let taggedCount = 0;
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Firestore query already filtered by createdAt < cutoff,
        // so every doc here is outdated — no JS date check needed.
        batch.update(docSnap.ref, {
            isOutdated: true,
            updatedAt: firestore_2.FieldValue.serverTimestamp(),
        });
        taggedCount++;
        notifyPromises.push(sendPushToUser(data.userId, 'Is your post still accurate?', `"${data.title}" is ${OUTDATED_DAYS}+ days old. Confirm it's still correct or archive it.`, { type: 'POST_OUTDATED', postId: docSnap.id, postTitle: data.title }));
    });
    if (taggedCount > 0) {
        await batch.commit();
        await Promise.allSettled(notifyPromises);
        console.log(`[checkOutdated] Tagged ${taggedCount} posts`);
    }
    else {
        console.log('[checkOutdated] No outdated posts today');
    }
});
// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 3: onPostArchived
// ─────────────────────────────────────────────────────────────────────────────
exports.onPostArchived = (0, firestore_1.onDocumentUpdated)('posts/{postId}', async (event) => {
    var _a, _b;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!before || !after)
        return;
    if (before.isArchived === after.isArchived)
        return;
    if (!after.isArchived)
        return;
    const photoURL = after.photoURL;
    if (!photoURL) {
        console.log(`[onPostArchived] Post ${event.params.postId} has no photo.`);
        return;
    }
    // Extract Cloudinary public_id from URL
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{ver}/{public_id}.{ext}
    const uploadMarker = '/upload/';
    const uploadIndex = photoURL.indexOf(uploadMarker);
    if (uploadIndex === -1) {
        console.warn(`[onPostArchived] Not a Cloudinary URL: ${photoURL}`);
        return;
    }
    let afterUpload = photoURL.slice(uploadIndex + uploadMarker.length);
    afterUpload = afterUpload.replace(/^v\d+\//, '');
    const publicId = afterUpload.replace(/\.[^.]+$/, ''); // ← always assigned, no try/catch needed
    if (!publicId) {
        console.warn(`[onPostArchived] Could not extract public_id from: ${photoURL}`);
        return;
    }
    console.log(`[onPostArchived] Deleting Cloudinary asset: ${publicId}`);
    try {
        const cloudName = CLOUDINARY_CLOUD_NAME.value();
        const apiKey = CLOUDINARY_API_KEY.value();
        const apiSecret = CLOUDINARY_API_SECRET.value();
        const timestamp = Math.floor(Date.now() / 1000);
        const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(toSign).digest('hex');
        const body = new URLSearchParams({
            public_id: publicId,
            timestamp: String(timestamp),
            api_key: apiKey,
            signature,
        });
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });
        const result = await res.json();
        if (result.result === 'ok') {
            console.log(`[onPostArchived] Deleted ${publicId}`);
        }
        else if (result.result === 'not found') {
            console.log(`[onPostArchived] Asset ${publicId} already deleted.`);
        }
        else {
            console.warn(`[onPostArchived] Unexpected response for ${publicId}:`, result);
        }
    }
    catch (err) {
        console.warn(`[onPostArchived] Cloudinary delete failed for ${publicId}:`, err instanceof Error ? err.message : String(err));
    }
});
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
exports.suggestCategory = (0, https_1.onCall)({ enforceAppCheck: false }, // set true if you enable App Check later
async (request) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Login required.');
    }
    const title = (_c = (_b = (_a = request.data) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 10,
                messages: [
                    {
                        role: 'user',
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
        const data = await res.json();
        const raw = ((_f = (_e = (_d = data === null || data === void 0 ? void 0 : data.content) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : '').trim();
        const category = (_g = VALID_CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase())) !== null && _g !== void 0 ? _g : null;
        return { category };
    }
    catch (err) {
        console.warn('[suggestCategory] Fetch failed:', err instanceof Error ? err.message : String(err));
        return { category: null };
    }
});
//# sourceMappingURL=index.js.map