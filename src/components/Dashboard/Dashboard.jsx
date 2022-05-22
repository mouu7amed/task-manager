import { Avatar, Button, Typography, Alert, Snackbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import { Box } from "@mui/system";

export const Dashboard = () => {
  const [photo, setPhoto] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const { currentUser, logout, changeAvatar } = useAuth();
  const navigate = useNavigate();

  const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
    return <Alert ref={ref} elevation={2} {...props} />;
  });

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  const uploadAvatarHandler = async () => {
    try {
      setError("");
      setLoading(true);
      await changeAvatar(photo)
        .then(() => setSnackBarOpen(true))
        .catch((err) => setError(err.message));
    } catch {
      console.log("Error Uploading your Photo!");
    }

    setPhoto(null);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.photoURL) {
      setAvatar(currentUser.photoURL);
    }
  }, [currentUser.photoURL]);

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      p={6}
    >
      <Avatar src={avatar} alt="user-image" sx={{ width: 56, height: 56 }} />

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

      <Typography variant="h4">
        {currentUser?.displayName ? currentUser.displayName : "null"}
      </Typography>

      <Typography variant="body">
        {currentUser?.email ? currentUser.email : "null"}
      </Typography>

      <Button
        variant="contained"
        onClick={logoutHandler}
        sx={{ margin: "8px" }}
        disableElevation
      >
        Logout
      </Button>

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
  );
};
