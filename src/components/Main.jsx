import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

const textVariants = {
  hidden: {
    x: "-100vw",
  },
  visible: {
    x: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      type: "spring",
      stiffness: 120,
    },
  },
};

const buttonsVariants = {
  hidden: {
    x: "100vw",
  },
  visible: {
    x: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      type: "spring",
      stiffness: 120,
    },
  },
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.9,
  },
};

export const Main = () => {
  return (
    <Container maxWidth="md" component={"main"}>
      <Box>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            component={motion.div}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h3" component={motion.h1} color="primary.main">
              Task Manager
            </Typography>
            <Typography variant="body" color="text.secondary">
              Organize yourself by Managing your Tasks All in one place.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            component={motion.div}
            variants={buttonsVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              href="/login"
              variant="contained"
              sx={{ mb: 2 }}
              fullWidth
              disableElevation
              component={motion.a}
              variants={buttonsVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.3 }}
            >
              Login
            </Button>
            <Button
              href="/register"
              variant="contained"
              fullWidth
              disableElevation
              component={motion.a}
              variants={buttonsVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.3 }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
