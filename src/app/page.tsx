// app/page.tsx
"use client";
import { useAuth } from './contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import { signInWithGoogle } from './utils/AuthActions';

export default function Home() {
    const { user, userData } = useAuth();
    const router = useRouter();

    const handleAuth = async () => {
        const result = await signInWithGoogle();
        if (result.success) {
            // Redirect or update UI as needed
            router.push('/commissions');
        } else {
            alert("Failed to sign in. Please try again.");
        }
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.title} data-text="Pluutform">Pluutform</h1>
            <p className={styles.description}>
                A renaissance of content creation. Patrons propose, Creators inspire.
            </p>
            {user ? (
                <div className={styles.userInfo}>
                    <p>Welcome, esteemed {user.displayName}!</p>
                    <p>Patron since: {new Date(userData?.createdAt).toLocaleDateString()}</p>
                    <p className={styles.cta}>Ready to commission your next masterpiece?</p>
                    <button onClick={() => router.push('/commission')} className={styles.ctaButton}>
                        Create Commission
                    </button>
                </div>
            ) : (
                <div className={styles.authSection}>
                    <p className={styles.cta}>Join the perfect system and shape the future of content!</p>
                    <button onClick={handleAuth} className={styles.authButton}>
                        Sign In with Google
                    </button>
                    <p className={styles.authInfo}>
                        Don't have an account? Signing in will create one for you.
                    </p>
                </div>
            )}
        </main>
    );
}