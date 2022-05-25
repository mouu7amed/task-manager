import {
  Typography,
  Divider,
  Stack,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const AccountSettings = ({ userEmail }) => {
  const [expanded, setExpanded] = useState("EmailPanel");

  const handleExpandtion = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
        Account
      </Typography>
      <Divider />
      <Stack spacing={2}>
        <Accordion
          sx={{ mt: 2 }}
          elevation={0}
          expanded={expanded === "EmailPanel"}
          onChange={(e, isExpanded) =>
            handleExpandtion(isExpanded, "EmailPanel")
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Email</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <Box p={1}>
              <Typography display="inline-flex" sx={{ fontWeight: 500 }}>
                {userEmail}
              </Typography>
              <Typography display="inline-flex" color="primary" sx={{ ml: 1 }}>
                - Primary
              </Typography>
              <Typography sx={{ ml: 1 }} variant="body2" color="text.secondary">
                Not visible in emails
              </Typography>
              <Typography sx={{ ml: 1 }} variant="body2" color="text.secondary">
                Receives notifications
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion
          elevation={0}
          expanded={expanded === "PasswordPanel"}
          onChange={(e, isExpanded) =>
            handleExpandtion(isExpanded, "PasswordPanel")
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Change Password</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 1 }}>
            <Stack width={300} alignItems="flex-start">
              <TextField
                label="Current"
                type="password"
                sx={{ padding: 1, input: { padding: 1 } }}
              />
              <TextField
                label="New"
                type="password"
                sx={{ padding: 1, input: { padding: 1 } }}
              />
              <TextField
                label="Re-type new"
                type="password"
                sx={{ padding: 1, input: { padding: 1 } }}
              />
            </Stack>
          </AccordionDetails>
          <AccordionActions>
            <Button variant="contained" color="success" disableElevation>
              Change password
            </Button>
          </AccordionActions>
        </Accordion>
      </Stack>
    </>
  );
};
