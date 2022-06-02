import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import moment from "moment";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { AddTask } from "../Tasks/AddTask";

export const ListUserTasks = ({ userTasks }) => {
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" mt={6}>
        <AddTask />
      </Box>
      <Box flexBasis={{ lg: "75%", xs: "100%" }} mt={1} p={2}>
        {userTasks.map((task) => (
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
                    <PublicIcon
                      sx={{ fontSize: 14, color: "text.secondary" }}
                    />
                  ) : (
                    <LockIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                  )}
                </Box>
              </Stack>
            </Stack>

            <Box p={2}>
              <Typography>{task.task}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
};
