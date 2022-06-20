import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const ListTasks = ({ tasks }) => {
  return (
    <Box flexBasis={{ lg: "75%", xs: "100%" }} mt={1} p={2}>
      {tasks.map((task) => (
        <Paper key={task.id} sx={{ mb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {moment(task.createdAt.toDate()).format("MMM Do YYYY")} at{" "}
              {moment(task.createdAt.toDate()).format("h:mma")}
            </Typography>

            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Stack>

          <Box sx={{ padding: "0 1rem 1rem" }}>
            <Typography fontWeight={600} mb={2}>
              {task.taskTitle}
            </Typography>
            <Typography>{task.taskBody}</Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};
