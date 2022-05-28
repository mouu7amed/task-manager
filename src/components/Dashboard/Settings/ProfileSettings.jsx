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

export const ProfileSettings = ({ avatar, userInfo }) => {
  const [photoBuffer, setPhotoBuffer] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [changePhone, setChangePhone] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [expanded, setExpanded] = useState("NamePanel");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({
    firstName: "",
    lastName: "",
    phone: "",
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
      await changeAvatar(photoBuffer)
        .then(() => setSnackBarOpen(true))
        .catch((err) => setError(err.message));
    } catch {
      console.log(error);
    }

    setPhotoBuffer(null);
    setLoading({
      ...loading,
      photo: false,
    });
  };

  const updateInfoHandler = async () => {
    //Name Validation
    const fullName = `${
      firstName.charAt(0).toUpperCase() + firstName.slice(1)
    } ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;

    if (!firstName && !lastName && !phoneValue) {
      return;
    }

    if (firstName && !firstName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        ...validationError,
        firstName: "Please enter a valid first name",
        lastName: "",
      });
      setFirstName("");
      return;
    }

    if (lastName && !lastName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        ...validationError,
        firstName: "",
        lastName: "Please enter a valid last name",
      });
      setLastName("");
      return;
    }

    //Phone Validation
    if (
      phoneValue &&
      !phoneValue.match(/^\(?([0-9]{4})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ) {
      setValidationError({
        ...validationError,
        phone: "Enter a valid phone number",
      });
      return;
    }

    try {
      setLoading({
        ...loading,
        info: true,
      });
      setError("");
      setValidationError("");

      if (firstName && lastName) {
        await updateProfile(currentUser, { displayName: fullName })
          .then(() => setSnackBarOpen(true))
          .catch((err) => setError(err.message));
      }

      if (phoneValue) {
        const docId = userInfo.map((info) => info.id);
        await updateDoc(doc(db, "user", docId[0]), {
          phone: phoneValue,
        })
          .then(() => setSnackBarOpen(true))
          .catch((err) => setError(err.messgae));
      }
    } catch (error) {
      console.log(error.message);
    }

    setFirstName("");
    setLastName("");
    setPhoneValue("");
    setLoading({
      ...loading,
      info: false,
    });
  };

  const changeBioHandler = async () => {
    if (!bioValue) {
      return;
    }

    try {
      setValidationError("");
      setLoading({
        ...loading,
        bio: true,
      });

      const docId = userInfo.map((info) => info.id);
      await updateDoc(doc(db, "user", docId[0]), {
        bio: bioValue,
      })
        .then(() => setSnackBarOpen(true))
        .catch((err) => setError(err.messgae));
    } catch (error) {
      console.log(error.message);
    }

    setBioValue("");
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
          <AccordionDetails>
            <Stack
              direction={{ md: "row", xs: "column-reverse" }}
              spacing={4}
              justifyContent="space-between"
            >
              <Stack spacing={2}>
                <Box>
                  <Typography fontWeight={500}>Name</Typography>
                  <Stack direction={"row"} spacing={2} mb={1} mt={1}>
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
                <Box>
                  <Typography fontWeight={500} sx={{ mb: 2 }}>
                    Phone Number
                  </Typography>
                  <Box>
                    <Typography fontWeight={400} display="inline-flex">
                      {userInfo.map((info) => info.phone)}
                    </Typography>
                    <Typography
                      fontWeight={400}
                      display="inline-flex"
                      color="primary"
                      sx={{ ml: 1, cursor: "pointer" }}
                      component="span"
                      onClick={() => {
                        setChangePhone(!changePhone);
                      }}
                    >
                      - Change
                    </Typography>
                    <Typography
                      sx={{ ml: 1 }}
                      variant="body2"
                      color="text.secondary"
                    >
                      Not visible in phones
                    </Typography>
                    <Typography
                      sx={{ ml: 1 }}
                      variant="body2"
                      color="text.secondary"
                    >
                      Receives notifications
                    </Typography>
                  </Box>
                  {changePhone && (
                    <TextField
                      disabled={loading.info}
                      label="Phone"
                      placeholder="0102 848 3696"
                      type="tel"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(e.target.value)}
                      error={!!validationError.phone}
                      helperText={
                        !!validationError.phone && validationError.phone
                      }
                      sx={{ mt: 2 }}
                    />
                  )}
                </Box>
              </Stack>
              <Box height={"fit-content"}>
                <Typography fontWeight={500} sx={{ mb: 1 }}>
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

                  {!photoBuffer ? (
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
                        onChange={(e) => setPhotoBuffer(e.target.files[0])}
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
              </Box>
            </Stack>
          </AccordionDetails>
          <AccordionActions>
            <LoadingButton
              variant="contained"
              color="success"
              disableElevation
              onClick={updateInfoHandler}
              loading={loading.info}
            >
              Update Info
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
          <AccordionDetails>
            <TextField
              label="Bio"
              placeholder="Tell us a little bit about yourself"
              disabled={loading.bio}
              type="text"
              sx={{ width: { sm: 458 } }}
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
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
