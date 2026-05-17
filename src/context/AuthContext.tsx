'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  dbUser: any | null; // Represents the user document in Firestore
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && db) {
        try {
          // 1. Fetch user's role from the secure roles/{uid} collection
          const roleRef = doc(db, 'roles', firebaseUser.uid);
          const roleDoc = await getDoc(roleRef);
          let userRole = 'customer';
          
          if (roleDoc.exists()) {
            userRole = roleDoc.data().role || 'customer';
          }

          // 2. Fetch or create user profile document in Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const currentProfile = userDoc.data();
            // Keep user profile in sync with the actual verified role
            if (currentProfile.role !== userRole) {
              const updatedProfile = { ...currentProfile, role: userRole, updatedAt: serverTimestamp() };
              await setDoc(userRef, updatedProfile, { merge: true });
              setDbUser(updatedProfile);
            } else {
              setDbUser(currentProfile);
            }
          } else {
            const newUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              role: userRole,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            await setDoc(userRef, newUser);
            setDbUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching/syncing user auth state:', error);
          // Safety fallback: construct a temporary local profile to unlock the screen
          setDbUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: 'customer',
          });
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) return;
    await auth.signOut();
  };

  const deleteAccount = async () => {
    if (!user || !db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      await user.delete();
    } catch (error) {
      console.error('Error deleting account', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, signInWithGoogle, signInWithEmail, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
