import React, { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Alert,
  Snackbar,
  Container,
  Box,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { db } from "../../utilities/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} elevation={2} {...props} />;
});

export const Profile = () => {
  const [bio, setBio] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const { userName, userEmail, avatar } = useOutletContext();

  useEffect(() => {
    document.title = !!userName ? userName : "Profile";

    onSnapshot(collection(db, "profile"), (snapshot) => {
      const bioText = snapshot.docs.map((doc) => doc.data().bio);
      setBio(bioText);
    });
  }, [userName]);

  return (
    <Container maxWidth="md">
      {/* Profile */}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        mt={2}
      >
        <Avatar
          src={avatar}
          alt="avatar"
          sx={{ width: 100, height: 100, mb: 2 }}
        />

        <Typography variant="h5">{userName}</Typography>

        <Typography variant="body">{userEmail}</Typography>

        <Typography variant="body">{bio}</Typography>

        <Snackbar
          open={snackBarOpen}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <SnackbarAlert
            severity="info"
            onClose={(e, reason) => {
              if (reason === "clickaway") {
                return;
              }
              setSnackBarOpen(false);
            }}
          >
            Avatar Changed successfully!
          </SnackbarAlert>
        </Snackbar>
      </Box>
    </Container>
  );
};
