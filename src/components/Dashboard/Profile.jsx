import React, { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Typography,
  Alert,
  Snackbar,
  Container,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../utilities/AuthProvider";
import { useOutletContext } from "react-router-dom";

const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} elevation={2} {...props} />;
});

export const Profile = () => {
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const { userName, userEmail, avatar } = useOutletContext();
  const { changeAvatar } = useAuth();

  useEffect(() => {
    document.title = !!userName ? userName : "Profile";
  }, [userName]);

  const uploadAvatarHandler = async () => {
    try {
      setError("");
      setLoading(true);
      await changeAvatar(photo)
        .then(() => setSnackBarOpen(true))
        .catch((err) => setError(err.message));
    } catch {
      console.log(error);
    }

    setPhoto(null);
    setLoading(false);
  };

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
        <Avatar src={avatar} alt="avatar" sx={{ width: 56, height: 56 }} />

        {!photo ? (
          <Button component="label" sx={{ margin: "8px" }}>
            Upload Image
            <input
              type="file"
              hidden
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </Button>
        ) : (
          <LoadingButton
            variant="contained"
            sx={{ margin: "8px" }}
            onClick={uploadAvatarHandler}
            loading={loading}
            disableElevation
          >
            Change
          </LoadingButton>
        )}

        <Typography variant="h4">{userName}</Typography>

        <Typography variant="body">{userEmail}</Typography>

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
