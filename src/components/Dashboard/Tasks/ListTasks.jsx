import { Box, Typography } from "@mui/material";
import React from "react";

export const ListTasks = ({ tasks }) => {
  return (
    <Box bgcolor={"white"} borderRadius={4}>
      {tasks.map((task) => (
        <Box key={task.id} p={2}>
          <Typography fontWeight={500}>{task.title}</Typography>
          <Typography>{task.body}</Typography>
        </Box>
      ))}
    </Box>
  );
};
