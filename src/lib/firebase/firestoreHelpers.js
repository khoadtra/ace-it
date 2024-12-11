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

// Fetches all flashcard sets, optionally filtered by a specific user ID
export const getFlashcardSets = async (userId = null) => {
    try {
        const setsRef = collection(fbdb, "flashcardSets"); // Reference to the flashcardSets collection

        // If userId is provided, apply a query to filter by ownerId
        const q = userId ? query(setsRef, where("ownerId", "==", userId)) : setsRef;
        const querySnapshot = await getDocs(q); // Execute the query

        // Map each document to an object containing its ID and data
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        throw error; // Re-throw the error for further handling
    }
};

// Fetches a single flashcard set by its ID
export const getFlashcardSetById = async (setId) => {
    try {
        const setRef = doc(fbdb, "flashcardSets", setId); // Reference to the specific flashcard set
        const setDoc = await getDoc(setRef); // Fetch the document

        if (!setDoc.exists()) throw new Error("Flashcard set not found"); // Handle non-existent set
        return { id: setDoc.id, ...setDoc.data() }; // Return the set's data along with its ID
    } catch (error) {
        console.error("Error fetching flashcard set:", error);
        throw error;
    }
};

// Adds or updates a flashcard set in Firestore
export const saveFlashcardSet = async (userId, set) => {
    try {
        const setRef = doc(fbdb, "flashcardSets", set.id || undefined); // Reference to a new or existing set

        // Prepare the data to save, ensuring required fields are set
        const setData = {
            ...set,
            ownerId: userId, // Ensure the set has an owner ID
            title: set.title || "Untitled Set", // Default title if none is provided
            terms: Array.isArray(set.terms) ? set.terms : [], // Ensure terms is an array
            ownerName: set.ownerName, // Include the owner's name
            iconColor: set.iconColor || "#cccccc", // Default icon color if not provided
        };

        if (setData.terms.length === 0) {
            throw new Error("Terms list cannot be empty."); // Validate that terms are not empty
        }

        await setDoc(setRef, setData, { merge: true }); // Save or update the document in Firestore
        console.log("Flashcard set saved successfully:", setData); // Log success
    } catch (error) {
        console.error("Error saving flashcard set:", error.message);
        throw error;
    }
};

// Deletes a flashcard set by its ID
export const deleteFlashcardSet = async (setId) => {
    try {
        const setRef = doc(fbdb, "flashcardSets", setId); // Reference to the specific set to delete
        await deleteDoc(setRef); // Delete the document from Firestore
    } catch (error) {
        console.error("Error deleting flashcard set:", error);
        throw error;
    }
};
