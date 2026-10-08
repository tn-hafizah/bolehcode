import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';

export const ADMIN_EMAIL = 'hafizahzakaria@unisza.edu.my';

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function checkIsAdmin(user: FirebaseUser | null): Promise<boolean> {
  if (!user) return false;
  if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      return true;
    }
  } catch (e) {
    // ignore
  }

  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists();
  } catch (error) {
    console.warn('Admin check error:', error);
    return false;
  }
}
