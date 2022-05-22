import {
  Avatar,
  Box,
  TextField,
  Container,
  Typography,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../utilities/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const boxVariants = {
  hidden: {
    opacity: 0,
    y: "100vh",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, type: "spring", stiffness: 120 },
  },
  tap: {
    scale: 0.9,
  },
};

export const ForgotPassword = () => {
  const emailRef = useRef();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const { currentUser, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
    return <Alert ref={ref} elevation={2} {...props} />;
  });

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setIsError("");

      const email = emailRef.current.value;
      await resetPassword(email)
        .then(() => setSnackBarOpen(true))
        .catch((error) => setIsError(error.message));
    } catch {
      console.log("Error Restting Your Password.");
    }

    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component={motion.div}
        variants={boxVariants}
        initial="hidden"
        animate="visible"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>

        <Box component="form" onSubmit={forgotPasswordHandler} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            label="Email"
            type="email"
            fullWidth
            required
            disabled={loading}
            error={!!isError}
            helperText={!!isError && "Email Address Not Exist!"}
            inputRef={emailRef}
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            disableElevation
            loading={loading}
            component={motion.button}
            variants={boxVariants}
            whileTap="tap"
          >
            Reset
          </LoadingButton>
        </Box>

        <Link href="/login" underline="hover" variant="body2">
          Login?
        </Link>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Copyright ©{" "}
          <Link color="inherit" href="https://linkedin.com/in/mouu7amed">
            Mohammed Azzab
          </Link>
        </Typography>
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
            Check The Message Sent to your Email!
          </SnackbarAlert>
        </Snackbar>
      </Box>
    </Container>
  );
};
