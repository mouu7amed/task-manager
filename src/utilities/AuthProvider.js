import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return await auth.signInWithEmailAndPassword(email, password);
  };

  const register = async (email, password) => {
    return await auth.createUserWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    return await auth.signOut();
  };

  const resetPassword = async (email) => {
    return await auth.sendPasswordResetEmail(email);
  };

  const changeAvatar = async (file) => {
    const storage = getStorage();
    const fileRef = ref(
      storage,
      `thumbnails/${currentUser.uid}/${file.name}.png`
    );
    const img = await uploadBytes(fileRef, file);
    const imgUrl = await getDownloadURL(img.ref);

    // upload avatar
    await updateProfile(currentUser, {
      photoURL: imgUrl,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        resetPassword,
        changeAvatar,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
