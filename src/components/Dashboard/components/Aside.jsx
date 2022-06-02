import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CollectionsIcon from "@mui/icons-material/Collections";

export const Aside = ({ userInfo, avatar, userName }) => {
  const coverSrc = userInfo.map((info) => info.cover);

  return (
    <Paper
      sx={{
        flexBasis: "25%",
        height: 400,
        display: { lg: "block", xs: "none" },
      }}
    >
      <Box position="relative" height={"100%"}>
        <Box>
          <Avatar
            variant="square"
            src={coverSrc[0]}
            alt=""
            sx={{ width: "100%", height: "120px" }}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          position="absolute"
          width={"100%"}
          top={"70px"}
        >
          <Avatar src={avatar} alt="" sx={{ width: 100, height: 100, mb: 1 }} />
          <Typography fontWeight={500} fontSize={18}>
            {userName}
          </Typography>
          <Typography>{userInfo.map((info) => info.bio)}</Typography>
          <Typography variant="body2" color="text.secondary">
            10 Connection
          </Typography>
          <Button variant="outlined" color="success" sx={{ mt: 1 }}>
            My Profile
          </Button>
        </Box>
        <Stack
          width={"100%"}
          position="absolute"
          bottom={0}
          justifyContent="center"
          alignItems="center"
        >
          <Divider sx={{ width: "100%" }} />
          <Stack direction="row" p={2} spacing={6}>
            <IconButton>
              <PeopleIcon />
            </IconButton>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
            <IconButton>
              <CollectionsIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};
