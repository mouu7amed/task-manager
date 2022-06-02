import { Avatar, IconButton, MenuItem, Paper, TextField } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../../utilities/firebase";
import SendIcon from "@mui/icons-material/Send";
import { Box } from "@mui/system";

export const AddTask = ({ userUid, avatar, userName }) => {
  const [taskBody, setTaskBody] = useState("");
  const [privacy, setPrivacy] = useState("public");

  const addTaskHandler = async (e) => {
    e.preventDefault();

    if (taskBody === "") {
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        owner: userUid,
        creatorName: userName,
        creatorAvatar: avatar,
        task: taskBody,
        createdAt: new Date(),
        privacy: privacy,
        liked: false,
      });
    } catch (error) {
      console.log(error.message);
    }

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
      <Box
        width={"100%"}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Avatar src={avatar} alt="" />
        <TextField
          placeholder="What's on your mind?"
          type={"text"}
          fullWidth
          value={taskBody}
          onChange={(e) => setTaskBody(e.target.value)}
          sx={{ fieldset: { border: "none" } }}
        />
      </Box>
      <Box
        width={"100%"}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <TextField
          placeholder="Privacy"
          select
          value={privacy}
          onChange={(e) => {
            setPrivacy(e.target.value);
          }}
          sx={{ fieldset: { border: "none" }, width: "150px", mr: 1 }}
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="onlyme">Only Me</MenuItem>
        </TextField>
        <IconButton
          variant="contained"
          type="submit"
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.light" },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};
