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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { forwardRef, useState } from "react";
import { useAuth } from "../../../utilities/AuthProvider";
import { updateProfile } from "firebase/auth";
import { LoadingButton } from "@mui/lab";

const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} elevation={2} {...props} />;
});

export const ProfileSettings = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expanded, setExpanded] = useState("NamePanel");
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({
    firstName: "",
    lastName: "",
  });

  const { currentUser } = useAuth();

  const handleExpandtion = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeNameHandler = async () => {
    const fullName = `${
      firstName.charAt(0).toUpperCase() + firstName.slice(1)
    } ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;

    if (!firstName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        firstName: "Please enter a valid first name",
        lastName: "",
      });
      setFirstName("");
      return;
    }

    if (!lastName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        firstName: "",
        lastName: "Please enter a valid last name",
      });
      setLastName("");
      return;
    }

    try {
      setLoading(true);
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
    setLoading(false);
  };

  const changeBioHandler = () => {};

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
            <Typography sx={{ fontWeight: 600 }}>Name</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <Stack direction={"row"} spacing={2} mb={1}>
              <TextField
                label="First Name"
                disabled={loading}
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!validationError.firstName}
                helperText={
                  !!validationError.firstName && validationError.firstName
                }
              />
              <TextField
                disabled={loading}
                label="Last Name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!validationError.lastName}
                helperText={
                  !!validationError.lastName && validationError.lastName
                }
              />
            </Stack>
          </AccordionDetails>
          <AccordionActions>
            <LoadingButton
              variant="contained"
              color="success"
              disableElevation
              onClick={changeNameHandler}
              loading={loading}
            >
              Update Name
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
              type="text"
              sx={{ width: { sm: 458 } }}
            />
          </AccordionDetails>
          <AccordionActions>
            <LoadingButton
              variant="contained"
              color="success"
              disableElevation
              onClick={changeBioHandler}
              loading={loading}
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
              ? "Name changed successfully!"
              : "Error changing your name!"}
          </SnackbarAlert>
        </Snackbar>
      </Stack>
    </>
  );
};
