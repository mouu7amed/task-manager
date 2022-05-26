import {
  Divider,
  Typography,
  Stack,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionActions,
  AccordionSummary,
  Alert,
  Snackbar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { forwardRef, useState } from "react";
import { useAuth } from "../../../utilities/AuthProvider";
import { updateProfile } from "firebase/auth";
import { LoadingButton } from "@mui/lab";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../utilities/firebase";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} elevation={2} {...props} />;
});

export const ProfileSettings = ({ avatar }) => {
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bioText, setBioText] = useState("");
  const [expanded, setExpanded] = useState("NamePanel");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [loading, setLoading] = useState({
    info: false,
    photo: false,
    bio: false,
  });

  const { currentUser, changeAvatar } = useAuth();

  const handleExpandtion = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changePhotoHandler = async () => {
    try {
      setError("");
      setLoading({
        ...loading,
        photo: true,
      });
      await changeAvatar(photo)
        .then(() => setSnackBarOpen(true))
        .catch((err) => setError(err.message));
    } catch {
      console.log(error);
    }

    setPhoto(null);
    setLoading({
      ...loading,
      photo: false,
    });
  };

  const changeNameHandler = async () => {
    const fullName = `${
      firstName.charAt(0).toUpperCase() + firstName.slice(1)
    } ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;

    if (!firstName || !lastName) {
      return;
    }

    if (!firstName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        firstName: "Please enter a valid first name",
        lastName: "",
        bio: "",
      });
      setFirstName("");
      return;
    }

    if (!lastName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        firstName: "",
        lastName: "Please enter a valid last name",
        bio: "",
      });
      setLastName("");
      return;
    }

    try {
      setLoading({
        ...loading,
        info: true,
      });
      setError("");
      setValidationError("");

      await updateProfile(currentUser, { displayName: fullName })
        .then(() => setSnackBarOpen(true))
        .catch((err) => setError(err.message));
    } catch {
      console.log("Error changing your name!");
    }

    setFirstName("");
    setLastName("");
    setLoading({
      ...loading,
      info: false,
    });
  };

  const changeBioHandler = async () => {
    const profileCollectionRef = doc(db, "profile", "YOSHhP6UGR4IxAAxYw0l");

    if (!bioText) {
      return;
    }

    try {
      setValidationError("");
      setLoading({
        ...loading,
        bio: true,
      });
      await updateDoc(profileCollectionRef, {
        bio: bioText,
      })
        .then(() => setSnackBarOpen(true))
        .catch((err) => setError(err.messgae));
    } catch {
      console.log("Error changing your bio!");
    }

    setBioText("");
    setLoading({
      ...loading,
      bio: false,
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
        Profile
      </Typography>
      <Divider />
      <Stack spacing={2}>
        <Accordion
          sx={{ mt: 2 }}
          elevation={0}
          expanded={expanded === "NamePanel"}
          onChange={(e, isExpanded) =>
            handleExpandtion(isExpanded, "NamePanel")
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Info</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <Stack
              direction={{ md: "row", xs: "column-reverse" }}
              spacing={4}
              justifyContent="space-between"
            >
              <Box>
                <Typography sx={{ fontWeight: 500 }}>Name</Typography>
                <Stack direction={"row"} spacing={2} mb={1}>
                  <TextField
                    label="First Name"
                    disabled={loading.info}
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!!validationError.firstName}
                    helperText={
                      !!validationError.firstName && validationError.firstName
                    }
                  />
                  <TextField
                    disabled={loading.info}
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!!validationError.lastName}
                    helperText={
                      !!validationError.lastName && validationError.lastName
                    }
                  />
                </Stack>
              </Box>
              <Box sx={{ position: "relative" }}>
                <Typography sx={{ fontWeight: 500 }}>
                  Profile Picture
                </Typography>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={avatar}
                    alt="avatar"
                    sx={{ width: 200, height: 200 }}
                  />
                  <Fade
                    in={loading.photo}
                    sx={{
                      position: "absolute",
                      top: "40%",
                      left: "40%",
                    }}
                  >
                    <CircularProgress />
                  </Fade>
                </Box>
                {!photo ? (
                  <Button
                    variant="contained"
                    disableElevation
                    component="label"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      textTransform: "initial",
                    }}
                  >
                    Edit
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      textTransform: "initial",
                    }}
                    disabled={loading.photo}
                    startIcon={<DoneIcon />}
                    onClick={changePhotoHandler}
                  >
                    Change
                  </Button>
                )}
              </Box>
            </Stack>
          </AccordionDetails>
          <AccordionActions>
            <LoadingButton
              variant="contained"
              color="success"
              disableElevation
              onClick={changeNameHandler}
              loading={loading.info}
            >
              Update Settings
            </LoadingButton>
          </AccordionActions>
        </Accordion>

        <Accordion
          elevation={0}
          expanded={expanded === "BioPanel"}
          onChange={(e, isExpanded) => handleExpandtion(isExpanded, "BioPanel")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Bio</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <TextField
              label="Bio"
              placeholder="Tell us a little bit about yourself"
              disabled={loading.bio}
              type="text"
              sx={{ width: { sm: 458 } }}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              error={!!validationError.bio}
              helperText={!!validationError.bio && validationError.bio}
            />
          </AccordionDetails>
          <AccordionActions>
            <LoadingButton
              variant="contained"
              color="success"
              disableElevation
              onClick={changeBioHandler}
              loading={loading.bio}
            >
              Save
            </LoadingButton>
          </AccordionActions>
        </Accordion>

        <Snackbar
          open={snackBarOpen}
          autoHideDuration={2000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <SnackbarAlert
            severity={!error ? "info" : "error"}
            onClose={(e, reason) => {
              if (reason === "clickaway") {
                return;
              }
              setSnackBarOpen(false);
            }}
          >
            {!error
              ? "Settings changed successfully!"
              : "Error changing settings!"}
          </SnackbarAlert>
        </Snackbar>
      </Stack>
    </>
  );
};
