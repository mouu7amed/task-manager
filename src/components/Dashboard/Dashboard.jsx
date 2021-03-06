import { Box } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import { db } from "../../utilities/firebase";
import { Header } from "./components/Header";

export const Dashboard = ({ title }) => {
  const [userUid, setUserUid] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [title]);

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
      const q = query(collection(db, "users"), where("owner", "==", userUid));
      onSnapshot(q, (snapshot) => {
        setUserInfo(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    };

    const getAllTasks = async () => {
      const q = query(collection(db, "tasks"), where("owner", "==", userUid));
      onSnapshot(q, (snapshot) => {
        setTasks(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    };

    getUserInfo();
    getAllTasks();
  }, [userUid]);

  return (
    <>
      <Header userName={userName} avatar={avatar} userInfo={userInfo} />
      <Box
        sx={{ backgroundColor: "#E4F2FD", minHeight: "calc(100vh - 214px)" }}
      >
        {location.pathname === "/dashboard" ? (
          <Box display="flex" pt={1} pb={1}>
            {/* TODO add dashboard charts here  */}
            Dashboard Charts Will be added here in the future ...
          </Box>
        ) : (
          <Outlet
            context={{
              userUid,
              userName,
              userEmail,
              avatar,
              userInfo,
              tasks,
            }}
          />
        )}
      </Box>
    </>
  );
};
