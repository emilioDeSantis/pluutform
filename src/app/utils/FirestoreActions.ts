// app/utils/firestoreActions.ts
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    query,
    where,
    getDocs,
    DocumentData,
    QueryDocumentSnapshot,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { db } from "./FirebaseInit";

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    createdAt: string;
}

export interface Commission {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: string;
    status: "open" | "in-progress" | "completed";
    endorsements: number;
    endorsedBy: string[];
    endorsed?: boolean;
}

export const createUserDocument = async (user: FirebaseUser): Promise<void> => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { uid, email, displayName, photoURL } = user;
        try {
            await setDoc(userRef, {
                uid,
                email,
                displayName,
                photoURL,
                createdAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
};

export const getUserDocument = async (uid: string): Promise<User | null> => {
    if (!uid) return null;

    try {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            return snapshot.data() as User;
        }
    } catch (error) {
        console.error("Error fetching user document", error);
    }

    return null;
};

export const addCommission = async (userId: string, title: string, description: string): Promise<{ success: boolean; id?: string; error?: any }> => {
    try {
      const docRef = await addDoc(collection(db, "commissions"), {
        userId,
        title,
        description,
        createdAt: new Date().toISOString(),
        status: 'open' as const,
        endorsements: 0,
        endorsedBy: []  // Initialize as an empty array
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding commission: ", error);
      return { success: false, error };
    }
  };
export const endorseCommission = async (
    commissionId: string,
    userId: string
): Promise<{ success: boolean; error?: any }> => {
    try {
        const commissionRef = doc(db, "commissions", commissionId);
        const commissionDoc = await getDoc(commissionRef);

        if (!commissionDoc.exists()) {
            return { success: false, error: "Commission not found" };
        }

        const commission = commissionDoc.data() as Commission;
        const endorsedBy = commission.endorsedBy || [];
        const isEndorsed = endorsedBy.includes(userId);

        await updateDoc(commissionRef, {
            endorsements: isEndorsed ? increment(-1) : increment(1),
            endorsedBy: isEndorsed ? arrayRemove(userId) : arrayUnion(userId),
        });

        return { success: true };
    } catch (error) {
        console.error("Error endorsing commission: ", error);
        return { success: false, error };
    }
};

export const getAllCommissions = async (
    userId?: string
): Promise<{ success: boolean; commissions?: Commission[]; error?: any }> => {
    try {
        const commissionsRef = collection(db, "commissions");
        const querySnapshot = await getDocs(commissionsRef);
        const commissions: Commission[] = querySnapshot.docs.map(
            (doc: QueryDocumentSnapshot<DocumentData>) => {
                const data = doc.data() as Omit<Commission, "id">;
                return {
                    ...data,
                    id: doc.id,
                    endorsedBy: data.endorsedBy || [],
                    endorsed: userId
                        ? (data.endorsedBy || []).includes(userId)
                        : false,
                };
            }
        );
        return { success: true, commissions };
    } catch (error) {
        console.error("Error getting all commissions: ", error);
        return { success: false, error };
    }
};

// Update getUserCommissions to include endorsement information
export const getUserCommissions = async (
    userId: string
): Promise<{ success: boolean; commissions?: Commission[]; error?: any }> => {
    try {
        const q = query(
            collection(db, "commissions"),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const commissions: Commission[] = querySnapshot.docs.map(
            (doc: QueryDocumentSnapshot<DocumentData>) => {
                const data = doc.data() as Commission;
                return {
                    ...data,
                    id: doc.id,
                    endorsed: data.endorsedBy.includes(userId),
                };
            }
        );
        return { success: true, commissions };
    } catch (error) {
        console.error("Error getting user commissions: ", error);
        return { success: false, error };
    }
};
