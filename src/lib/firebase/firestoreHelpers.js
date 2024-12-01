import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";
import { fbdb } from "./config";

// Get flashcard sets (all or filtered by userId)
export const getFlashcardSets = async (userId = null) => {
    try {
        const setsRef = collection(fbdb, "flashcardSets");

        // Apply filtering if userId is provided
        const q = userId ? query(setsRef, where("ownerId", "==", userId)) : setsRef;
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        throw error;
    }
};

// Get a single flashcard set by ID
export const getFlashcardSetById = async (setId) => {
    try {
        const setRef = doc(fbdb, "flashcardSets", setId);
        const setDoc = await getDoc(setRef);

        if (!setDoc.exists()) throw new Error("Flashcard set not found");
        return { id: setDoc.id, ...setDoc.data() };
    } catch (error) {
        console.error("Error fetching flashcard set:", error);
        throw error;
    }
};

// Add or update a flashcard set
export const saveFlashcardSet = async (userId, set) => {
    try {
        const setRef = doc(fbdb, "flashcardSets", set.id || undefined);
        const setData = {
            ...set,
            ownerId: userId, // Ensure ownership
            title: set.title || "Untitled Set", // Default title if missing
            terms: Array.isArray(set.terms) ? set.terms : [], // Ensure terms is always a list
            ownerName: set.ownerName, // Include ownerName
            iconColor: set.iconColor || "#cccccc", // Provide a default icon color
        };

        if (setData.terms.length === 0) {
            throw new Error("Terms list cannot be empty.");
        }

        await setDoc(setRef, setData, { merge: true });
        console.log("Flashcard set saved successfully:", setData);
    } catch (error) {
        console.error("Error saving flashcard set:", error.message);
        throw error;
    }
};


// Delete a flashcard set
export const deleteFlashcardSet = async (setId) => {
    try {
        const setRef = doc(fbdb, "flashcardSets", setId);
        await deleteDoc(setRef);
    } catch (error) {
        console.error("Error deleting flashcard set:", error);
        throw error;
    }
};
