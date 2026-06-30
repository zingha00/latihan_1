import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
          setCurrentUser({ ...user, ...docSnap.data() });
        } else {
          // dokumen users/{uid} hilang (data korup/terhapus manual) — tetap
          // expose data auth dasar dengan role: null biar halaman lain bisa
          // redirect ke fallback, bukan crash karena field role undefined
          setUserRole(null);
          setCurrentUser({ ...user, role: null });
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function register({ name, email, password, phoneNumber, role, address }) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    const userData = { name, email, role, phoneNumber };
    if (role === "mitra") {
      userData.address = address;
    }
    await setDoc(doc(db, "users", user.uid), userData);
    // onAuthStateChanged di atas otomatis trigger setelah ini dan fetch
    // ulang dokumen users/{uid}, jadi currentUser tidak perlu di-set manual
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
    // fetch role/name dilakukan oleh listener onAuthStateChanged, bukan di sini
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}