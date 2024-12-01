"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, fbdb } from "@/lib/firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(fbdb, "users", currentUser.uid);
                    let userDoc = await getDoc(userDocRef);

                    // If user document doesn't exist, create it
                    if (!userDoc.exists()) {
                        const userData = {
                            userName: currentUser.displayName || "",
                            userID: currentUser.uid,
                            email: currentUser.email,
                            icon: (currentUser.displayName || "").charAt(0).toUpperCase(),
                            iconColor: "#4a90e2", // Default color
                        };
                        await setDoc(userDocRef, userData);
                        userDoc = await getDoc(userDocRef);
                    }

                    // Update user state
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        ...userDoc.data(),
                    });
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error.message);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    // Update user data in Firestore and context
    const updateUser = async (updatedUserData) => {
        if (user) {
            try {
                const userDocRef = doc(fbdb, "users", user.uid);
                await setDoc(userDocRef, updatedUserData, { merge: true });

                // Update Firebase Auth profile if userName has changed
                if (updatedUserData.userName && updatedUserData.userName !== user.userName) {
                    await updateProfile(auth.currentUser, {
                        displayName: updatedUserData.userName,
                    });
                }

                // Update local user state
                setUser((prevUser) => ({
                    ...prevUser,
                    ...updatedUserData,
                }));
            } catch (error) {
                console.error("Error updating user data:", error.message);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
