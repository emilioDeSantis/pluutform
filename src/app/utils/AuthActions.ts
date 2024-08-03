// app/utils/authActions.ts
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { createUserDocument } from "./FirestoreActions";
import { auth } from "./FirebaseInit";

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Create user document in Firestore
        await createUserDocument(user);

        return { success: true, user };
    } catch (error) {
        console.error("Error signing in with Google", error);
        return { success: false, error };
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error signing out", error);
        return { success: false, error };
    }
};