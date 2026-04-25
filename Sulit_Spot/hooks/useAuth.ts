import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthResult {
	user: User | null | undefined;
	loading: boolean;
	isLoggedIn: boolean;
	uid: string | null;
	name: string | null;
	email: string | null;
}

export const useAuth = (): AuthResult => {
	// Start as undefined — distinguishes "still loading" from "not logged in"
	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		// onAuthStateChanged fires immediately with the current state
		// then again on every login/logout
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
			setUser(firebaseUser);   // null if logged out, User object if logged in
			setLoading(false);
		});

		// Detach the listener when the component using this hook unmounts
		return unsubscribe;
	}, []);

	return {
		user,
		loading,
		isLoggedIn: !!user,
		uid: user?.uid ?? null,
		name: user?.displayName ?? null,
		email: user?.email ?? null,
	};
};