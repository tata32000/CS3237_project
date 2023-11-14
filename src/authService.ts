import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

// Function to handle Google SignIn
export const signInWithGoogle = async (): Promise<User | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    return result.user;
  } catch (error) {
    // Handle Errors here.
    console.error(error);
    return null;
  }
};

// Function to sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

// Utility function to check current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
