import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../utilities/firebase";
import AddIcon from "@mui/icons-material/Add";

export const AddTask = ({ userUid }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskBody, setTaskBody] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (taskBody !== "" && taskTitle !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [taskTitle, taskBody]);

  const addTaskHandler = async (e) => {
    e.preventDefault();

    if (taskBody === "" || taskTitle === "") {
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        owner: userUid,
        taskTitle: taskTitle,
        taskBody: taskBody,
        createdAt: new Date(),
        completed: false,
      });
    } catch (error) {
      console.log(error.message);
    }

    setTaskTitle("");
    setTaskBody("");
  };

  return (
    <Paper
      component={"form"}
      onSubmit={addTaskHandler}
      elevation={2}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        p: 2,
        borderRadius: "5px",
        width: "500px",
        flexBasis: { lg: "50%", xs: "100%" },
      }}
    >
      <Stack width={"100%"}>
        <Typography fontWeight={500} fontSize={18}>
          Add a Task
        </Typography>
        <TextField
          placeholder="Task Title"
          type={"text"}
          fullWidth
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          sx={{ fieldset: { border: "none" } }}
        />
        <TextField
          placeholder="Task Description"
          type={"text"}
          fullWidth
          value={taskBody}
          onChange={(e) => setTaskBody(e.target.value)}
          sx={{ fieldset: { border: "none" } }}
        />
        <Button
          variant="contained"
          type="submit"
          endIcon={<AddIcon />}
          disabled={disabled}
        >
          Add Task
        </Button>
      </Stack>
    </Paper>
  );
};
