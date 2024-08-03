// app/commission/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Commission.module.css';
import { addCommission, getUserCommissions, Commission } from '../utils/FirestoreActions';

export default function CommissionPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userCommissions, setUserCommissions] = useState<Commission[]>([]);

    useEffect(() => {
        if (user) {
            fetchUserCommissions();
        }
    }, [user]);

    const fetchUserCommissions = async () => {
        if (user) {
            const result = await getUserCommissions(user.uid);
            if (result.success && result.commissions) {
                setUserCommissions(result.commissions);
            } else {
                console.error("Failed to fetch user commissions:", result.error);
                setUserCommissions([]); // Set to empty array if fetch fails
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            const result = await addCommission(user.uid, title, description);
            if (result.success) {
                alert('Your commission has been added to the gallery!');
                setTitle('');
                setDescription('');
                fetchUserCommissions(); // Refresh the list of user's commissions
            } else {
                alert('There was an error submitting your commission. Please try again.');
            }
        }
    };

    if (!user) {
        router.push('/signup');
        return null;
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Commission a Masterpiece</h1>
            <p className={styles.subtitle}>Inspire creators with your vision</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title of your commission"
                    required
                    className={styles.input}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your vision in detail"
                    required
                    className={styles.textarea}
                />
                <button type="submit" className={styles.submitButton}>Submit to Gallery</button>
            </form>

            <h2 className={styles.subtitle}>Your Commissions</h2>
            <div className={styles.commissionsList}>
                {userCommissions.map((commission) => (
                    <div key={commission.id} className={styles.commissionItem}>
                        <h3>{commission.title}</h3>
                        <p>{commission.description}</p>
                        <p>Status: {commission.status}</p>
                        <p>Created: {new Date(commission.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}