import {
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Avatar,
  Box,
  FormControlLabel,
  Checkbox,
  Container,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../utilities/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const boxVariants = {
  hidden: {
    opacity: 0,
    x: "100vw",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, type: "spring", stiffness: 120 },
  },
  tap: {
    scale: 0.9,
  },
};

export const Register = ({ title }) => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { currentUser, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [title, currentUser, navigate]);

  const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
    return <Alert ref={ref} elevation={2} {...props} />;
  });

  const registerHandler = async (e) => {
    e.preventDefault();

    const firstName =
      firstNameRef.current.value.charAt(0).toUpperCase() +
      firstNameRef.current.value.slice(1);
    const lastName =
      lastNameRef.current.value.charAt(0).toUpperCase() +
      lastNameRef.current.value.slice(1);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // password verification
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 digits!");
      return;
    }

    // create account
    try {
      setLoading(true);
      setIsError("");
      setEmailError("");
      setPasswordError("");

      await register(email, password)
        .then((res) => {
          if (res.user) {
            const fullName = `${firstName} ${lastName}`;
            res.user.updateProfile({ displayName: fullName });
          }

          setSnackBarOpen(true);
        })
        .catch((error) => {
          setEmailError(
            "The email address is already in use by another account."
          );
        });
    } catch {
      console.log("Error Creating your Account!");
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
          <PeopleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        {/* Start Form */}
        <Box component="form" onSubmit={registerHandler} sx={{ mt: 2 }}>
          <Stack direction={"row"} spacing={2} mb={1}>
            <TextField
              fullWidth
              label="First Name"
              disabled={loading}
              type="text"
              required
              inputRef={firstNameRef}
            />

            <TextField
              fullWidth
              disabled={loading}
              label="Last Name"
              type="text"
              required
              inputRef={lastNameRef}
            />
          </Stack>
          <TextField
            fullWidth
            margin="normal"
            disabled={loading}
            label="Email"
            type="email"
            error={!!emailError}
            helperText={!!emailError && emailError}
            required
            inputRef={emailRef}
          />
          <TextField
            fullWidth
            margin="normal"
            disabled={loading}
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!passwordError}
            helperText={
              !!passwordError
                ? passwordError
                : "Use 6 or more characters using letters, numbers, or symbols"
            }
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputRef={passwordRef}
          />

          <FormControlLabel
            control={
              <Checkbox
                required
                disabled={loading}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            }
            label="I agree to privacy terms and conditions."
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
            Register
          </LoadingButton>
        </Box>
        {/* End Form */}

        <Typography variant="body" sx={{ mb: 2 }}>
          Already have an account?{" "}
          <Link href="/login" underline="hover">
            Login
          </Link>
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center">
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
            severity={!isError && !emailError ? "info" : "error"}
            onClose={(e, reason) => {
              if (reason === "clickaway") {
                return;
              }
              setSnackBarOpen(false);
            }}
          >
            {!emailError
              ? "Registered successfully!"
              : "Error Creating your Account!"}
          </SnackbarAlert>
        </Snackbar>
      </Box>
    </Container>
  );
};
