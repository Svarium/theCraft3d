import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAndCreateUser = async (firebaseUser, additionalData = {}) => {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        const newData = {
            name: additionalData.name || firebaseUser.displayName,
            photoURL: additionalData.photoURL || firebaseUser.photoURL
        };

        if (!userSnap.exists()) {
            const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: newData.name || firebaseUser.email.split('@')[0],
                photoURL: newData.photoURL || null,
                role: "user",
                createdAt: serverTimestamp(),
            };
            await setDoc(userRef, userData);
            return userData;
        } else {
            // Self-healing: Update if we have better data now than what's in Firestore
            const currentData = userSnap.data();
            const updates = {};

            // If Firestore name is missing or looks like an email handle AND we have a real name now
            if ((!currentData.name || currentData.name.includes('@')) && newData.name) {
                updates.name = newData.name;
            }

            // If Firestore photo is missing AND we have a real photo now
            if (!currentData.photoURL && newData.photoURL) {
                updates.photoURL = newData.photoURL;
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
                return { ...currentData, ...updates };
            }

            return currentData;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // Eagerly fetch/create user data to ensure state is ready before redirection
            const userData = await checkAndCreateUser(result.user);
            setUser({ ...result.user, ...userData });
            return result.user;
        } catch (error) {
            throw error;
        }
    };

    const loginWithEmail = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const registerWithEmail = async (email, password, name) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Create user in Firestore with the provided name
        await checkAndCreateUser(result.user, { name });
        // Send verification email
        await sendEmailVerification(result.user);
        return result.user;
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch extra data from Firestore
                try {
                    const userData = await checkAndCreateUser(firebaseUser);
                    setUser({ ...firebaseUser, ...userData }); // Merge Auth + Firestore data
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(firebaseUser); // Fallback
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
