import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  Stack,
  Toolbar,
  Badge,
} from "@mui/material";
import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../utilities/AuthProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Navbar = ({ userName, avatar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const showMenu = Boolean(anchorEl);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const logoutHandler = async () => {
    setShowLogoutDialog(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Button
          color="inherit"
          sx={{
            textTransform: "initial",
            fontSize: { sm: 18, xs: 16 },
          }}
          onClick={() => navigate("/dashboard", { replace: true })}
        >
          TaskManager
        </Button>
        <Stack direction="row" spacing={2} ml="auto">
          <IconButton color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <Button
            color="inherit"
            endIcon={<KeyboardArrowDownIcon color="inherit" />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-controls={showMenu ? "user-menu" : undefined}
            aria-expanded={showMenu ? "true" : undefined}
            aria-haspopup="true"
          >
            <Avatar src={avatar} alt="avatar" sx={{ width: 32, height: 32 }} />
          </Button>
        </Stack>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={showMenu}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          elevation={3}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("profile");
            }}
            sx={{ fontWeight: 500 }}
          >
            {userName}
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("settings");
            }}
          >
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setShowLogoutDialog(true);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
        <Dialog
          open={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          TransitionComponent={Transition}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Are you sure to Logout?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              By Logging out you will be redirected to the Login page where it
              will require your Email and Password again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowLogoutDialog(false)}>
              Stay Logged in
            </Button>
            <Button onClick={logoutHandler}>Logout</Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};
