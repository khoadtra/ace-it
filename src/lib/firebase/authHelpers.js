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

// Helper function to register a new user
export const registerUser = async (username, email, password) => {
    try {
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            throw new Error("Username is already taken. Please choose a different one.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, { displayName: username });

        const userData = {
            userName: username,
            userID: userCredential.user.uid,
            icon: username.charAt(0).toUpperCase(),
            iconColor: "#4a90e2", // Default icon color
            email,
        };

        await setDoc(doc(fbdb, "users", userCredential.user.uid), userData);

        return {
            ...userCredential,
            userData,
        };
    } catch (error) {
        console.error("Error registering user:", error.message);
        throw error;
    }
};

// Helper function to log in using email or username
export const signInUser = async (emailOrUsername, password) => {
    try {
        let email = emailOrUsername;

        if (!email.includes("@")) {
            const usersQuery = query(
                collection(fbdb, "users"),
                where("userName", "==", emailOrUsername)
            );
            const querySnapshot = await getDocs(usersQuery);
            if (!querySnapshot.empty) {
                email = querySnapshot.docs[0].data().email;
            } else {
                throw new Error("No account found with that username.");
            }
        }

        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing in user:", error.message);
        throw error;
    }
};
