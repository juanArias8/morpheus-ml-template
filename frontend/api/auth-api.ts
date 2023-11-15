import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const AUTH_ERROR = "Something went wrong with your authentication process";

export const signUpWithEmailAndPasswordFirebase = async (
  user: any,
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(mapAuthCodeToMessage[error.code] || AUTH_ERROR);
  }
};

export const loginWithEmailAndPasswordFirebase = async (
  user: any,
): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(mapAuthCodeToMessage[error.code] || AUTH_ERROR);
  }
};

export const sendUserPasswordResetEmail = async (
  email: string,
): Promise<any> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(mapAuthCodeToMessage[error.code] || AUTH_ERROR);
  }
};

export const loginWithGoogleFirebase = async (): Promise<any> => {
  try {
    const provider: GoogleAuthProvider = new GoogleAuthProvider();
    const userCredential: UserCredential = await signInWithPopup(
      auth,
      provider,
    );
    console.log(userCredential);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(
      mapAuthCodeToMessage[error.code] ||
        "Something went wrong with your authentication process",
    );
  }
};

export const signOutFirebase = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error: any) {
    throw new Error(mapAuthCodeToMessage[error.code] || AUTH_ERROR);
  }
};

export const logout = async () => {
  try {
    await signOutFirebase();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } catch (error) {
    alert(error);
  }
};

const mapAuthCodeToMessage: { [key: string]: string } = {
  "auth/wrong-password": "Password provided is not correct",
  "auth/invalid-password": "Password provided is not correct",
  "auth/invalid-email": "Email provided is invalid",
  "auth/invalid-display-name": "Display name provided is invalid",
  "auth/invalid-phone-number": "Phone number provided is invalid",
  "auth/invalid-photo-url": "Photo URL provided is invalid",
  "auth/invalid-uid": "UID provided is invalid",
  "auth/invalid-provider-id": "Provider ID provided is invalid",
  "auth/email-already-in-use": "Email provided is already in use",
  "auth/user-not-found": "User not found",
};
