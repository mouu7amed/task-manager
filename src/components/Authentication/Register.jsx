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
import React, { forwardRef, useEffect, useState } from "react";
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
    transition: { duration: 0.3, type: "spring" },
  },
  tap: {
    scale: 0.9,
  },
};

const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} elevation={2} {...props} />;
});

export const Register = ({ title }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [validationError, setValidationError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { currentUser, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [title, currentUser, navigate]);

  const registerHandler = async (e) => {
    e.preventDefault();

    // Validations
    if (!firstName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        firstName: "Enter a valid name",
        lastName: "",
        email: "",
        password: "",
      });
      setFirstName("");
      return;
    }

    if (!lastName.match(/^[a-zA-Z]+$/)) {
      setValidationError({
        firstName: "",
        lastName: "Enter a valid name",
        email: "",
        password: "",
      });
      setLastName("");
      return;
    }

    if (password.length < 6) {
      setValidationError({
        firstName: "",
        lastName: "",
        email: "",
        password: "Password must be at least 6 digits!",
      });
      return;
    }

    // create account
    try {
      setLoading(true);
      setValidationError({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      await register(email, password)
        .then(async (res) => {
          if (res.user) {
            const fullName = `${
              firstName.charAt(0).toUpperCase() + firstName.slice(1)
            } ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
            await res.user.updateProfile({ displayName: fullName });
          }
          setSnackBarOpen(true);
        })
        .catch((error) => {
          setValidationError({
            firstName: "",
            lastName: "",
            email: "The email address is already in use by another account.",
            password: "",
          });
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!validationError.firstName}
              helperText={
                !!validationError.firstName && validationError.firstName
              }
            />

            <TextField
              fullWidth
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
          <TextField
            fullWidth
            margin="normal"
            disabled={loading}
            label="Email"
            type="email"
            error={!!validationError.email}
            helperText={!!validationError.email && validationError.email}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            disabled={loading}
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!validationError.password}
            helperText={
              !!validationError.password
                ? validationError.password
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </Box>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <SnackbarAlert
          severity={"info"}
          onClose={(e, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setSnackBarOpen(false);
          }}
        >
          {!validationError.email && "Registered successfully!"}
        </SnackbarAlert>
      </Snackbar>
    </Container>
  );
};
