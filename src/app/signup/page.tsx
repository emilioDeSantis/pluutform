// app/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from "../utils/AuthActions";

export default function SignUp() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useAuth();

    const handleGoogleSignUp = async () => {
        const result = await signInWithGoogle();
        if (result.success) {
            alert("Sign up successful!");
            router.push('/');
        } else {
            setError("An error occurred during sign up. Please try again.");
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {user && <p>You are already signed in as {user.displayName}</p>}
        </div>
    );
}