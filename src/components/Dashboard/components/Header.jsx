import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { AddTask } from "../Tasks/AddTask";
import { Aside } from "./Aside";
import { Navbar } from "./Navbar";

export const Header = ({ userUid, userName, avatar, userInfo }) => {
  const location = useLocation();
  return (
    <Box>
      <Navbar userName={userName} avatar={avatar} />
      {location.pathname === "/dashboard" && (
        <Box
          height={150}
          bgcolor="primary.main"
          display="flex"
          position="relative"
        >
          <Stack
            direction="row"
            position="absolute"
            top="25%"
            spacing={1}
            width={"100%"}
            justifyContent="flex-start"
            alignItems="flex-start"
            pl={2}
            pr={2}
          >
            <Box
              height={"100%"}
              display={{ lg: "flex", xs: "none" }}
              justifyContent="center"
              alignItems="center"
              pl={1}
              flexBasis={"25%"}
            >
              <Avatar
                src={avatar}
                alt=""
                sx={{ width: 100, height: 100, mr: 1 }}
              />
              <Stack justifyContent="center" alignItems="center">
                <Typography fontWeight={500} sx={{ color: "white" }}>
                  {userName.split(" ").slice(0, -1).join(" ")}
                </Typography>
                <Typography fontSize={14} sx={{ color: "white" }}>
                  {userInfo.map((info) => info.bio)}
                </Typography>
              </Stack>
            </Box>
            <AddTask userUid={userUid} userName={userName} avatar={avatar} />
            <Aside userInfo={userInfo} avatar={avatar} userName={userName} />
          </Stack>
        </Box>
      )}
    </Box>
  );
};
