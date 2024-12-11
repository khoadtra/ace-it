import { GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { auth } from "@/lib/firebase/config";

// FirebaseUI config for Google Sign-In
const getUiConfig = () => ({
    signInFlow: "popup",
    signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",
    callbacks: {
        uiShown: () => {
            // UI shown callback
        },
        signInSuccessWithAuthResult: (authResult) => {
            window.location.href = "/"; // Redirect to home
            return false;
        },
        signInFailure: (error) => {
            console.error("Sign-in failed:", error.message);
            return Promise.resolve();
        },
    },
});

// Initialize FirebaseUI
let ui;
export const initializeFirebaseUI = () => {
    if (!ui) {
        ui = new firebaseui.auth.AuthUI(auth);
    }
    return ui;
};

// Start FirebaseUI
export const startFirebaseUI = (elementId) => {
    const ui = initializeFirebaseUI();
    const uiConfig = getUiConfig();

    if (!ui.isPendingRedirect()) {
        if (!document.querySelector(`${elementId} .firebaseui-container`)) {
            ui.start(elementId, uiConfig);
        }
    }
};
