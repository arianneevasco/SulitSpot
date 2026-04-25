import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type {
	Notification,
	NotificationResponse,
} from 'expo-notifications';
import {
	onForegroundNotification,
	onNotificationTap,
} from '../services/notificationService';

type NavigationRef = MutableRefObject<{
	isReady: () => boolean;
	navigate: (route: string, params?: Record<string, unknown>) => void;
} | null>;

type NotificationData = {
	type?: 'POST_OUTDATED' | 'POST_HIDDEN';
	postId?: string;
};

export const useNotifications = (navigationRef: NavigationRef) => {
	const foregroundUnsub = useRef<(() => void) | null>(null);
	const tapUnsub        = useRef<(() => void) | null>(null);

	useEffect(() => {
		// —— Foreground listener ————————————————————————————————
		foregroundUnsub.current = onForegroundNotification((notification: Notification) => {
			console.log(
				'[Notification] Received in foreground:',
				notification.request.content.title
			);
		});

		// —— Tap listener ————————————————————————————————————————
		tapUnsub.current = onNotificationTap((response: NotificationResponse) => {
			const data = response.notification.request.content.data as NotificationData;

			if (!navigationRef.current?.isReady()) return;

			if (data?.type === 'POST_OUTDATED') {
				navigationRef.current.navigate('EditPost', { postId: data.postId });
			} else if (data?.type === 'POST_HIDDEN') {
				navigationRef.current.navigate('MyPosts');
			}
		});

		return () => {
			if (foregroundUnsub.current) foregroundUnsub.current();
			if (tapUnsub.current) tapUnsub.current();
		};
	}, [navigationRef]);
};