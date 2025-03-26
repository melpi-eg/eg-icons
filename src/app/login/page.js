"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getCurrentUser, loginUser } from "@/api/users";
import { useRouter } from "next/navigation";
import { setUser } from "@/store/reducers/authSlice";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  // Access the current theme
  const theme = useTheme();

  const handleLogin = async () => {
    // Call the loginUser function
    const res = await loginUser({ username, email });

    // check for the sucess of login
    if (!res.error) {
      localStorage.setItem("access_token", res.data.token);

      // Get the current user and update the store
      getCurrentUser().then((res) => {
        if (!res.error) {
          // Update the store
          dispatch(setUser(res.data));
          // Redirect to the home page
          router.push("/home");
        }
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 3,
      }}
    >
      {/* Login Form Box */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: theme.palette.background.paper,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
          Login
        </Typography>

        {/* Username */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            padding: "10px",
            fontWeight: "bold",
            marginTop: 2,
          }}
          onClick={handleLogin}
        >
          Log In
        </Button>
      </Box>

      {/* Theme Toggle Button */}
    </Box>
  );
}
