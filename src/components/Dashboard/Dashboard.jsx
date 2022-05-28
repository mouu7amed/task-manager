import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import { Navbar } from "./Navbar";

export const Dashboard = () => {
  const [userUid, setUserUid] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userInfo, setUserInfo] = useState({
    id: "",
    owner: "",
    bio: "",
    phone: "",
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.uid) {
      setUserUid(currentUser.uid);
    }
    if (currentUser?.displayName) {
      setUserName(currentUser.displayName);
    }
    if (currentUser?.email) {
      setUserEmail(currentUser.email);
    }
    if (currentUser?.photoURL) {
      setAvatar(currentUser.photoURL);
    }
  }, [currentUser]);

  useEffect(() => {
    const setUserCollectionInfo = async () => {
      onSnapshot(collection(db, "user"), (snapshot) => {
        snapshot.forEach((res) =>
          setDoc(doc(db, "user", res.id), {
            id: res.id,
            owner: userUid,
            bio: "",
            phone: "",
          })
        );
      });
    };

    const getUserCollectionInfo = async () => {
      const userCollectionRef = collection(db, "user");
      const q = query(userCollectionRef, where("owner", "==", userUid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) =>
        setUserInfo({
          id: doc.id,
          owner: userUid,
          bio: doc.data().bio,
          phone: doc.data().phone,
        })
      );
    };

    setUserCollectionInfo();
    getUserCollectionInfo();
  }, [userUid]);

  return (
    <>
      <Navbar userName={userName} avatar={avatar} />
      <Box>
        <Outlet context={{ userUid, userName, userEmail, avatar, userInfo }} />
      </Box>
    </>
  );
};
