// app/components/Commission.tsx
"use client";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { endorseCommission } from '../utils/FirestoreActions';
import styles from './Commission.module.css';

interface CommissionProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: string;
  endorsements: number;
  endorsed?: boolean;
}

export default function Commission({ id, title, description, createdAt, status, endorsements, endorsed = false }: CommissionProps) {
  const { user } = useAuth();
  const [isEndorsed, setIsEndorsed] = useState(endorsed);
  const [endorsementCount, setEndorsementCount] = useState(endorsements);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEndorse = async () => {
    if (!user) {
      alert("Please log in to endorse commissions.");
      return;
    }

    setIsAnimating(true);
    const result = await endorseCommission(id, user.uid);
    if (result.success) {
      setIsEndorsed(!isEndorsed);
      setEndorsementCount(prev => isEndorsed ? prev - 1 : prev + 1);
    } else {
      alert("Failed to endorse commission. Please try again.");
    }
    setTimeout(() => setIsAnimating(false), 300); // Match this with animation duration
  };

  return (
    <div className={styles.commissionItem}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Status: {status}</p>
      <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
      <div className={styles.endorsementSection}>
        <button 
          onClick={handleEndorse} 
          className={`${styles.endorseButton} ${isEndorsed ? styles.endorsed : ''} ${isAnimating ? styles.animating : ''}`}
          disabled={isAnimating}
        >
          <div className={styles.iconWrapper}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={styles.minusIcon}>
              <path d="M5 12h14"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={styles.plusIcon}>
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
          </div>
        </button>
        <span className={styles.endorsementCount}>{endorsementCount}</span>
      </div>
    </div>
  );
}