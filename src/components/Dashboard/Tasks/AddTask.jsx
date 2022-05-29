import { Button, Stack, TextField } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../../utilities/firebase";

export const AddTask = ({ userUid }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskBody, setTaskBody] = useState("");

  const addTaskHandler = async (e) => {
    e.preventDefault();

    if (taskTitle === "" || taskBody === "") {
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        owner: userUid,
        title: taskTitle,
        body: taskBody,
      });
    } catch (error) {
      console.log(error.message);
    }

    setTaskTitle("");
    setTaskBody("");
  };

  return (
    <Stack
      component={"form"}
      justifyContent="center"
      alignItems="center"
      spacing={2}
      onSubmit={addTaskHandler}
    >
      <TextField
        label="title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <TextField
        label="body"
        value={taskBody}
        onChange={(e) => setTaskBody(e.target.value)}
      />
      <Button variant="contained" type="submit">
        Add
      </Button>
    </Stack>
  );
};
