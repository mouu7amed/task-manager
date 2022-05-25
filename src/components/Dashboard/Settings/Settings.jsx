import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import { ProfileSettings } from "./ProfileSettings";
import { AccountSettings } from "./AccountSettings";

export const Settings = () => {
  const [tabValue, setTabValue] = useState("1");

  const { userName, userEmail, avatar } = useOutletContext();

  return (
    <Container>
      <Stack
        direction={{ sm: "row", xs: "column" }}
        mt={2}
        mb={2}
        justifyContent={{ sm: "space-between", xs: "flex-start" }}
        alignItems="flex-start"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mb: { sm: 0, xs: 2 } }}
        >
          <Avatar
            src={avatar}
            alt="avatar"
            sx={{ width: 52, height: 52, mr: 2 }}
          />
          <Stack>
            <Typography variant="h6">{userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Your personal account
            </Typography>
          </Stack>
        </Box>
        <Button variant="contained" disableElevation href="profile">
          Go to your profile
        </Button>
      </Stack>

      <Stack>
        <TabContext value={tabValue}>
          <Stack direction={{ md: "row", xs: "column" }} mt={2}>
            <Stack>
              <TabList
                orientation="vertical"
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  ".MuiTabs-indicator": {
                    left: 0,
                  },
                }}
              >
                <Tab
                  label="Profile"
                  value="1"
                  icon={<PersonIcon />}
                  iconPosition="start"
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: "fit-content",
                  }}
                />
                <Tab
                  label="Account"
                  value="2"
                  icon={<SettingsIcon />}
                  iconPosition="start"
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: "fit-content",
                  }}
                />
                <Tab
                  label="Appearance"
                  value="3"
                  icon={<BrushOutlinedIcon />}
                  iconPosition="start"
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: "fit-content",
                  }}
                />
              </TabList>
            </Stack>
            <Stack sx={{ flexGrow: 1 }}>
              <TabPanel
                value="1"
                sx={{ padding: { md: "0 0 0 24px", xs: "24px 0 0 0" } }}
              >
                <ProfileSettings />
              </TabPanel>

              <TabPanel
                value="2"
                sx={{ padding: { sm: "0 0 0 24px", xs: "24px 0 0 0" } }}
              >
                <AccountSettings userEmail={userEmail} />
              </TabPanel>

              <TabPanel
                value="3"
                sx={{ padding: { sm: "0 0 0 24px", xs: "24px 0 0 0" } }}
              >
                <Typography>Appearance</Typography>
              </TabPanel>
            </Stack>
          </Stack>
        </TabContext>
      </Stack>
    </Container>
  );
};
