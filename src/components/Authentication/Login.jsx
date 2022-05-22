import {
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Avatar,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";

const boxVariants = {
  hidden: {
    opacity: 0,
    x: "-100vw",
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

export const Login = ({ title }) => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [remeberMe, setRemeberMe] = useState(false);

  const { currentUser, login } = useAuth();
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

  const loginHandler = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      setLoading(true);
      setIsError("");
      await login(email, password).catch((error) => setIsError(error.message));
      navigate("/dashboard", { replace: true });
    } catch {
      setIsError("incorrect email or password!");
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
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box component="form" onSubmit={loginHandler} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            label="Email"
            type="email"
            fullWidth
            required
            disabled={loading}
            error={!!isError}
            helperText={!!isError && "Incorrect Email Or Password"}
            inputRef={emailRef}
          />
          <TextField
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            disabled={loading}
            error={!!isError}
            helperText={!!isError && "Incorrect Email Or Password"}
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
                disabled={loading}
                checked={remeberMe}
                onChange={(e) => setRemeberMe(e.target.checked)}
              />
            }
            label="Remeber Me?"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            disableElevation
            loading={loading}
            endIcon={<LoginIcon />}
            component={motion.button}
            variants={boxVariants}
            whileTap="tap"
          >
            Login
          </LoadingButton>
        </Box>

        <Grid container>
          <Grid item xs>
            <Link href="/forgot-password" underline="hover">
              <Typography variant="body2">Forgot Password?</Typography>
            </Link>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link href="/register" underline="hover">
                Sign Up
              </Link>
            </Typography>
          </Grid>
        </Grid>

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
            severity={!!isError ? "error" : "info"}
            onClose={(e, reason) => {
              if (reason === "clickaway") {
                return;
              }
              setSnackBarOpen(false);
            }}
          >
            {!!isError ? isError : "Registered successfully!"}
          </SnackbarAlert>
        </Snackbar>
      </Box>
    </Container>
  );
};