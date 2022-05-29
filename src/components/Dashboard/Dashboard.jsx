import { Box, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import { db } from "../../utilities/firebase";
import { Navbar } from "./components/Navbar";
// import { AddTask } from "./Tasks/AddTask";
import { ListTasks } from "./Tasks/ListTasks";

export const Dashboard = () => {
  const [userUid, setUserUid] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { currentUser } = useAuth();
  const location = useLocation();

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

    const getTasks = async () => {
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
    getTasks();
  }, [userUid]);

  return (
    <>
      <Navbar userName={userName} avatar={avatar} />
      <Box
        sx={{
          backgroundColor: "#E4F2FD",
        }}
      >
        {location.pathname === "/dashboard" ? (
          <Box
            p={2}
            minHeight={{ sm: "calc(100vh - 64px)", xs: "calc(100vh - 56px)" }}
          >
            <Typography>Task Dashboard</Typography>
            {/* <AddTask userUid={userUid} /> */}
            <ListTasks tasks={tasks} />
          </Box>
        ) : (
          <Outlet
            context={{ userUid, userName, userEmail, avatar, userInfo }}
          />
        )}
      </Box>
    </>
  );
};
