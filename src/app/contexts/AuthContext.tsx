// app/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../utils/FirebaseInit';
import { getUserDocument } from '../utils/FirestoreActions';

type AuthContextType = {
    user: User | null;
    userData: any | null;
};

const AuthContext = createContext<AuthContextType>({ user: null, userData: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const userDoc = await getUserDocument(user.uid);
                setUserData(userDoc);
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData }}>
            {children}
        </AuthContext.Provider>
    );
};