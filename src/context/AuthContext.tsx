import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  authModalMessage?: string;
  openAuthModal: (mode?: 'signin' | 'signup', message?: string, onComplete?: () => void) => void;
  closeAuthModal: () => void;
  signUp: (email: string, pass: string, name: string, extraData?: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Auth modal control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>(undefined);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const fetchUserProfile = async (user: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        // Fallback default profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Patient',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.warn('Error fetching Firestore user profile, using Auth fallback:', error);
      setUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Patient',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
        if (pendingCallback) {
          pendingCallback();
          setPendingCallback(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pendingCallback]);

  const openAuthModal = (
    mode: 'signin' | 'signup' = 'signin',
    message?: string,
    onComplete?: () => void
  ) => {
    setAuthModalMode(mode);
    setAuthModalMessage(message);
    if (onComplete) {
      setPendingCallback(() => onComplete);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalMessage(undefined);
  };

  const signUp = async (
    email: string, 
    pass: string, 
    name: string, 
    extraData?: Partial<UserProfile>
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName: name });

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: name,
      phone: extraData?.phone || '',
      age: extraData?.age,
      gender: extraData?.gender || 'male',
      bloodGroup: extraData?.bloodGroup || '',
      emergencyContact: extraData?.emergencyContact || '',
      medicalConditions: extraData?.medicalConditions || '',
      allergies: extraData?.allergies || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), newProfile);
    } catch (e) {
      console.warn('Could not write user profile to firestore:', e);
    }

    setUserProfile(newProfile);
    setIsAuthModalOpen(false);
  };

  const signIn = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    await fetchUserProfile(userCredential.user);
    setIsAuthModalOpen(false);
  };

  const logOut = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserData = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No authenticated user');
    const updated = {
      ...userProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    } as UserProfile;

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), updated as any);
    } catch (e) {
      console.warn('Error updating user document in Firestore:', e);
    }

    if (data.displayName && data.displayName !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName: data.displayName });
    }

    setUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAuthModalOpen,
        authModalMode,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        signUp,
        signIn,
        logOut,
        resetPassword,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
