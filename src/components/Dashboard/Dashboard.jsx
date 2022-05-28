import { Box, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import { db } from "../../utilities/firebase";
import { Navbar } from "./Navbar";

export const Dashboard = () => {
  const [userUid, setUserUid] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userInfo, setUserInfo] = useState([]);

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
    const getUserInfo = async () => {
      const q = query(collection(db, "user"), where("owner", "==", userUid));
      onSnapshot(q, async (snapshot) => {
        setUserInfo(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            owner: userUid,
            ...doc.data(),
          }))
        );
      });
    };

    getUserInfo();
  }, [userUid]);

  return (
    <>
      <Navbar userName={userName} avatar={avatar} />
      <Box>
        {userInfo.map((info, i) => (
          <Box key={i} p={4}>
            <Typography>Doc id -- {info.id}</Typography>
            <Typography>Owner -- {info.owner}</Typography>
            <Typography>Bio -- {info.bio}</Typography>
            <Typography>Phone -- {info.phone}</Typography>
          </Box>
        ))}
        <Outlet context={{ userUid, userName, userEmail, avatar, userInfo }} />
      </Box>
    </>
  );
};
