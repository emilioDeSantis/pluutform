// app/commissions/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllCommissions, Commission as CommissionType } from '../utils/FirestoreActions';
import styles from './Commissions.module.css';
import Commission from '../components/Commission';

export default function CommissionsPage() {
    const { user } = useAuth();
    const [commissions, setCommissions] = useState<CommissionType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllCommissions();
    }, [user]);

    const fetchAllCommissions = async () => {
        setLoading(true);
        const result = await getAllCommissions(user?.uid);
        if (result.success && result.commissions) {
            setCommissions(result.commissions);
        } else {
            console.error("Failed to fetch commissions:", result.error);
        }
        setLoading(false);
    };

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Gallery of Commissions</h1>
            <p className={styles.subtitle}>Explore and endorse the visions awaiting realization</p>
            
            {loading ? (
                <p>Loading commissions...</p>
            ) : (
                <div className={styles.commissionsList}>
                    {commissions.map((commission) => (
                        <Commission
                            key={commission.id}
                            {...commission}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}