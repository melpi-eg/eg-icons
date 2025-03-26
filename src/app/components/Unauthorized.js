"use client";
import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FullScreenUnauthorized = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
        backdropFilter: "blur(8px)", // Blur effect
        zIndex: 1300, // Ensure it appears above other elements
      }}
    >
      <Dialog
        open={true} // Always open the dialog
        PaperProps={{
          style: {
            borderRadius: "12px",
            maxWidth: "400px",
            textAlign: "center",
          },
        }}
      >
        <DialogTitle>
          <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>
            Unauthorized Access
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Box>
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: theme.palette.text.primary,
              textAlign: "center",
            }}
          >
            You do not have permission to view this page.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Link href="/home" passHref>
              <Button variant="outlined" color="primary">
                Back to Home
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button variant="contained" color="primary">
                Go to Login
              </Button>
            </Link>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FullScreenUnauthorized;
