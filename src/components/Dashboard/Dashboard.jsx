import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import { Navbar } from "./Navbar";

export const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.displayName) {
      setUserName(currentUser.displayName);
    }
    if (currentUser?.email) {
      setUserEmail(currentUser.email);
    }
    if (currentUser?.photoURL) {
      setAvatar(currentUser.photoURL);
    }
  }, [currentUser.displayName, currentUser.email, currentUser.photoURL]);

  return (
    <>
      <Navbar userName={userName} avatar={avatar} />
      <Container>
        {/* Profile */}
        <Outlet context={{ userName, userEmail, avatar }} />
      </Container>
    </>
  );
};
