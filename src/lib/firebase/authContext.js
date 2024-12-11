"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, fbdb } from "@/lib/firebase/config";

// Create a Context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds the current authenticated user
    const [loading, setLoading] = useState(true); // Tracks loading state for authentication

    /**
     * Initializes the authentication state by listening to Firebase auth changes.
     * Fetches user data from Firestore or creates a new user document if none exists.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(fbdb, "users", currentUser.uid);
                    let userDoc = await getDoc(userDocRef);

                    // Create a new user document in Firestore if it doesn't exist
                    if (!userDoc.exists()) {
                        const userData = {
                            userName: currentUser.displayName || "", // Use displayName from Firebase Auth
                            userID: currentUser.uid,
                            email: currentUser.email,
                            icon: (currentUser.displayName || "").charAt(0).toUpperCase(), // Use first letter of displayName as icon
                            iconColor: "#4a90e2", // Default icon color
                        };
                        await setDoc(userDocRef, userData); // Save new user data in Firestore
                        userDoc = await getDoc(userDocRef); // Fetch the newly created document
                    }

                    // Update user state with Firestore and Firebase Auth data
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        ...userDoc.data(), // Merge additional user data from Firestore
                    });
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error.message);
                    alert("An error occurred while loading your profile. Please try again.");
                }
            } else {
                setUser(null); // Clear user state if not authenticated
            }
            setLoading(false); // End loading state
        });

        return () => unsubscribe(); // Cleanup the listener when component unmounts
    }, []);

    /**
     * Updates user data in Firestore and the local state.
     * Also updates Firebase Auth profile if the `userName` is changed.
     */
    const updateUser = async (updatedUserData) => {
        if (user) {
            try {
                const userDocRef = doc(fbdb, "users", user.uid); // Reference to the user's Firestore document
                await setDoc(userDocRef, updatedUserData, { merge: true }); // Merge updated data with existing data

                // Update Firebase Auth profile if `userName` has changed
                if (updatedUserData.userName && updatedUserData.userName !== user.userName) {
                    await updateProfile(auth.currentUser, {
                        displayName: updatedUserData.userName,
                    });
                }

                // Update the local user state
                setUser((prevUser) => ({
                    ...prevUser,
                    ...updatedUserData,
                }));
                alert("Profile updated successfully.");
            } catch (error) {
                console.error("Error updating user data:", error.message);
                alert("Failed to update your profile. Please try again.");
            }
        } else {
            console.warn("Attempted to update profile without a valid user.");
        }
    };

    return (
        // Provide the user, loading state, and updateUser function to children components
        <AuthContext.Provider value={{ user, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);
