import {
    signOut,
    fetchSignInMethodsForEmail,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth, fbdb } from "@/lib/firebase/config";
import {
    getDocs,
    query,
    where,
    collection,
    doc,
    setDoc,
} from "firebase/firestore";

// Checks if a username already exists in the Firestore database
export const checkUsernameExists = async (username) => {
    try {
        const usersQuery = query(
            collection(fbdb, "users"),
            where("userName", "==", username) // Query Firestore for a username match
        );
        const querySnapshot = await getDocs(usersQuery);
        return !querySnapshot.empty; // Return true if the username exists
    } catch (error) {
        console.error("Error checking if username exists:", error.message);
        throw new Error("An error occurred while checking the username. Please try again.");
    }
};

// Registers a new user and saves their data in Firestore
export const registerUser = async (username, email, password) => {
    try {
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            throw new Error("Username is already taken. Please choose a different one.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Create a Firebase Auth user

        await updateProfile(userCredential.user, { displayName: username }); // Set displayName in Firebase Auth

        const userData = {
            userName: username,
            userID: userCredential.user.uid,
            icon: username.charAt(0).toUpperCase(), // Use the first letter of the username as the icon
            iconColor: "#4a90e2", // Default icon color
            email,
        };

        await setDoc(doc(fbdb, "users", userCredential.user.uid), userData); // Save user data in Firestore

        return {
            ...userCredential,
            userData, // Return Firebase Auth and Firestore data
        };
    } catch (error) {
        console.error("Error registering user:", error.message);
        if (error.code === "auth/email-already-in-use") {
            throw new Error("The email address is already in use by another account.");
        } else if (error.code === "auth/weak-password") {
            throw new Error("The password is too weak. Please use a stronger password.");
        }
        throw new Error("Registration failed. Please try again.");
    }
};

// Logs in a user using their email or username
export const signInUser = async (emailOrUsername, password) => {
    try {
        let email = emailOrUsername;

        // If the input doesn't contain '@', treat it as a username
        if (!email.includes("@")) {
            const usersQuery = query(
                collection(fbdb, "users"),
                where("userName", "==", emailOrUsername) // Query Firestore for the username
            );
            const querySnapshot = await getDocs(usersQuery);
            if (!querySnapshot.empty) {
                email = querySnapshot.docs[0].data().email; // Resolve username to email
            } else {
                throw new Error("No account found with that username.");
            }
        }

        return await signInWithEmailAndPassword(auth, email, password); // Log in with email and password
    } catch (error) {
        console.error("Error signing in user:", error.message);
        if (error.code === "auth/user-not-found") {
            throw new Error("No account found with the provided email or username.");
        } else if (error.code === "auth/wrong-password") {
            throw new Error("Incorrect password. Please try again.");
        }
        throw new Error("Login failed. Please try again.");
    }
};

// Sends a password reset email to the user's email address
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email); // Trigger Firebase Auth password reset email
        console.log("Password reset email sent!");
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
        if (error.code === "auth/user-not-found") {
            throw new Error("No account found with the provided email.");
        }
        throw new Error("Failed to send password reset email. Please try again.");
    }
};
