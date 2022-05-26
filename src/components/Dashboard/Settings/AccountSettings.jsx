import {
  Typography,
  Divider,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import React, { forwardRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../../utilities/AuthProvider";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} elevation={2} {...props} />;
});

export const AccountSettings = ({ userEmail }) => {
  const [expanded, setExpanded] = useState("EmailPanel");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    invalidCurrentPassword: "",
    newPasswordLength: "",
    newPasswordNoMatch: "",
  });

  const { currentUser } = useAuth();

  const handleExpandtion = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changePasswordHandler = async () => {
    const emailCredential = EmailAuthProvider.credential(
      userEmail,
      currentPassword
    );

    if (!currentPassword || !newPassword || !reNewPassword) {
      return;
    }

    if (newPassword.length < 6) {
      setError({
        invalidCurrentPassword: "",
        newPasswordLength: "Password must be at least 6 digits",
        newPasswordNoMatch: "",
      });
      return;
    }

    if (newPassword !== reNewPassword) {
      setError({
        invalidCurrentPassword: "",
        newPasswordLength: "",
        newPasswordNoMatch: "Password doesn't match",
      });
      return;
    }

    try {
      setError({
        invalidCurrentPassword: "",
        newPasswordLength: "",
        newPasswordNoMatch: "",
      });
      setLoading(true);

      await reauthenticateWithCredential(currentUser, emailCredential)
        .then((res) => {
          updatePassword(res.user, newPassword);
          setSnackBarOpen(true);
        })
        .catch((error) => {
          setError({
            invalidCurrentPassword: "The password is invalid",
            newPasswordLength: "",
            newPasswordNoMatch: "",
          });
          setSnackBarOpen(true);
        });

      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setReNewPassword("");
    } catch {
      console.log("Error changing your password!");
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
        Account
      </Typography>
      <Divider />
      <Stack spacing={2}>
        <Accordion
          sx={{ mt: 2 }}
          elevation={0}
          expanded={expanded === "EmailPanel"}
          onChange={(e, isExpanded) =>
            handleExpandtion(isExpanded, "EmailPanel")
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Email</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <Box p={1}>
              <Typography display="inline-flex" sx={{ fontWeight: 500 }}>
                {userEmail}
              </Typography>
              <Typography display="inline-flex" color="primary" sx={{ ml: 1 }}>
                - Primary
              </Typography>
              <Typography sx={{ ml: 1 }} variant="body2" color="text.secondary">
                Not visible in emails
              </Typography>
              <Typography sx={{ ml: 1 }} variant="body2" color="text.secondary">
                Receives notifications
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion
          elevation={0}
          expanded={expanded === "PasswordPanel"}
          onChange={(e, isExpanded) =>
            handleExpandtion(isExpanded, "PasswordPanel")
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Change Password</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <Stack width={300} alignItems="flex-start">
              <TextField
                label="Current"
                type="password"
                sx={{ padding: 1, input: { padding: 1 } }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={!!error.invalidCurrentPassword}
                helperText={
                  !!error.invalidCurrentPassword && error.invalidCurrentPassword
                }
              />
              <TextField
                label="New"
                type="password"
                sx={{ padding: 1, input: { padding: 1 } }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!error.newPasswordLength}
                helperText={
                  !!error.newPasswordLength && error.newPasswordLength
                }
              />
              <TextField
                label="Re-type new"
                type="password"
                sx={{ padding: 1, input: { padding: 1 } }}
                value={reNewPassword}
                onChange={(e) => setReNewPassword(e.target.value)}
                error={!!error.newPasswordNoMatch}
                helperText={
                  !!error.newPasswordNoMatch && error.newPasswordNoMatch
                }
              />
            </Stack>
          </AccordionDetails>
          <AccordionActions>
            <LoadingButton
              variant="contained"
              color="success"
              disableElevation
              onClick={changePasswordHandler}
              loading={loading}
            >
              Change password
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
            severity={!error.invalidCurrentPassword ? "info" : "error"}
            onClose={(e, reason) => {
              if (reason === "clickaway") {
                return;
              }
              setSnackBarOpen(false);
            }}
          >
            {!error.invalidCurrentPassword
              ? "Password changed successfully!"
              : "Error changing your password!"}
          </SnackbarAlert>
        </Snackbar>
      </Stack>
    </>
  );
};
