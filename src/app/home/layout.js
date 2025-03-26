"use client";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/app/ThemeRegistry";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Sidebar from "@/app/components/Sidebar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "@/app/theme";
import { Box } from "@mui/material";
import ContextWrapper from "@/app/components/ContextWrapper";
import { getCurrentUser } from "@/api/users";
import useCurrentUser from "@/hooks/useCurrentUser";
const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isLoading, user } = useCurrentUser();

  useEffect(() => {
    // Check local storage or system preference
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setIsDarkMode(savedTheme === "dark");
      } else {
        setIsDarkMode(
          window.matchMedia("(prefers-color-scheme: dark)").matches
        );
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Header toggleTheme={toggleTheme} />
        <Sidebar />
        {children}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
