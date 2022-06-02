import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../utilities/firebase";

export const ListTasks = ({ tasks, avatar, userInfo }) => {
  const likeHandler = async (id, likeStatus) => {
    await updateDoc(doc(db, "tasks", id), { liked: !likeStatus });
  };

  return (
    <Box flexBasis={{ lg: "75%", xs: "100%" }} mt={6} p={2}>
      {tasks.map((task) => (
        <Paper key={task.id} sx={{ mb: 1 }}>
          <Stack p={2} direction="row" alignItems="center">
            <Avatar src={task.creatorAvatar} alt="" />
            <Stack ml={2}>
              <Typography fontWeight={600} fontSize={15}>
                {task.creatorName}
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  {moment(task.createdAt.toDate()).format("MMMM d, YYYY")} at{" "}
                  {moment(task.createdAt.toDate()).format("h:mma")}
                </Typography>
                {task.privacy === "public" ? (
                  <PublicIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                ) : (
                  <LockIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                )}
              </Box>
            </Stack>
          </Stack>

          <Box p={2}>
            <Typography>{task.task}</Typography>
          </Box>

          <Stack>
            <Divider />
            <Stack p={1} direction="row">
              <Button
                color={task.liked ? "primary" : "inherit"}
                startIcon={<FavoriteIcon />}
                onClick={() => likeHandler(task.id, task.liked)}
              >
                Like
              </Button>
              <Button color={"inherit"} startIcon={<CommentIcon />}>
                Comment
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};
