import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ childUser, children }) => {
  const [user, setUser] = useState({});
  const [googleUser, setGoogleUser] = useState(null);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      specUser(currentUser);
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const specUser = async (currUser) => {
    try {
      const assignUser = async () => {
        const q = query(
          collection(db, "users"),
          where("uid", "==", currUser.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setGoogleUser(doc.data());
        });
      };
      const docRef = doc(db, "users", currUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        assignUser();
      } else {
        await setDoc(doc(db, "users", currUser.uid), {
          user: currUser.displayName,
          uid: currUser.uid,
          email: currUser.email,
        });
      }
    } catch (error) {}
  };

  return (
    <UserContext.Provider
      value={{ createUser, user, logout, signIn, googleSignIn, googleUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
