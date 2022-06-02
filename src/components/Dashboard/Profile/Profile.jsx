import React, { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Alert,
  Snackbar,
  Container,
  Box,
  Stack,
  Button,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DoneIcon from "@mui/icons-material/Done";
import { useAuth } from "../../../utilities/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../utilities/firebase";
import { ListUserTasks } from "./ListUserTasks";

const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
  return <Alert ref={ref} elevation={2} {...props} />;
});

export const Profile = () => {
  const [photoBuffer, setPhotoBuffer] = useState("");
  const [cover, setCover] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [loading, setLoading] = useState({
    cover: false,
  });

  const { userName, avatar, userInfo, userTasks } = useOutletContext();
  const { changeCover } = useAuth();

  useEffect(() => {
    document.title = !!userName ? userName : "Profile";

    if (!cover) {
      const coverLink = userInfo.map((info) => info.cover);
      setCover(coverLink[0]);
    }
  }, [userName, cover, userInfo]);

  const changeCoverHandler = async () => {
    if (!photoBuffer) {
      return;
    }

    try {
      setLoading({
        ...loading,
        cover: true,
      });

      await changeCover(photoBuffer)
        .then(async (url) => {
          const docId = userInfo.map((info) => info.id);
          await updateDoc(doc(db, "users", docId[0]), { cover: url });
          setSnackBarOpen(true);
        })
        .catch((err) => console.log(err.message));
    } catch {
      console.log("Error changing your cover!");
    }

    setPhotoBuffer("");
    setLoading({
      ...loading,
      cover: false,
    });
  };

  return (
    <Box pt={2} minHeight="calc(100vh - 64px)">
      <Container>
        <Box
          p={1}
          height={320}
          borderRadius={4}
          sx={{ backgroundColor: "white" }}
        >
          <Box position={"relative"}>
            <Box borderRadius={4} overflow="hidden" position="relative">
              <Avatar
                src={cover}
                variant="rounded"
                sx={{ width: "100%", height: 200 }}
                alt="cover"
              />

              {!photoBuffer ? (
                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                  startIcon={<CameraAltIcon />}
                  component="label"
                  size="small"
                >
                  Edit Cover
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setPhotoBuffer(e.target.files[0])}
                  />
                </Button>
              ) : (
                <LoadingButton
                  variant="contained"
                  disableElevation
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                  startIcon={<DoneIcon />}
                  loading={loading.cover}
                  loadingPosition="start"
                  onClick={changeCoverHandler}
                >
                  Change
                </LoadingButton>
              )}
            </Box>

            <Stack
              direction={{ sm: "row", xs: "column" }}
              alignItems={{ sm: "flex-end", xs: "center" }}
              spacing={{ sm: 2, xs: 1 }}
              ml={{ sm: 6, xs: 0 }}
              position="absolute"
              bottom={{ sm: "-30%", xs: "-50%" }}
              left={{ sm: 0, xs: "50%" }}
              sx={{
                transform: { sm: "translateX(0)", xs: "translateX(-50%)" },
              }}
              minWidth={200}
            >
              <Avatar
                src={avatar}
                alt="avatar"
                sx={{
                  width: { sm: 120, xs: 100 },
                  height: { sm: 120, xs: 100 },
                }}
              />

              <Stack alignItems={{ sm: "flex-start", xs: "center" }}>
                <Typography
                  variant="body"
                  fontSize={{ sm: 18, xs: 16 }}
                  fontWeight={600}
                >
                  {userName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={{ sm: 15, xs: 13 }}
                >
                  {userInfo.map((info) => info.bio)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <ListUserTasks userTasks={userTasks} />

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
            Cover Changed successfully!
          </SnackbarAlert>
        </Snackbar>
      </Container>
    </Box>
  );
};
