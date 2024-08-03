// app/components/Header.tsx
"use client";
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { logOut, signInWithGoogle } from '../utils/AuthActions';

export default function Header() {
    const { user } = useAuth();
    const router = useRouter();

    const handleAuth = async () => {
        if (user) {
            const result = await logOut();
            if (result.success) {
                router.push('/');
            }
        } else {
            const result = await signInWithGoogle();
            if (result.success) {
                router.push('/');
            }
        }
    };

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>Pluutform</Link>
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/commissions" className={styles.navLink}>Gallery</Link>
                {user && <Link href="/commission" className={styles.navLink}>Commission</Link>}
                {user ? (
                    <>
                        <span className={styles.welcome}>Welcome, {user.displayName}</span>
                        <button onClick={handleAuth} className={styles.authButton}>Log Out</button>
                    </>
                ) : (
                    <button onClick={handleAuth} className={styles.authButton}>Log In</button>
                )}
            </nav>
        </header>
    );
}