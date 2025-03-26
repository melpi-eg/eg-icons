"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Menu,
  MenuItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { searchIcons } from "@/api/icons"; // Assuming this is an API call function
import { useRouter } from "next/navigation";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null); // Reference for input focus
  const router = useRouter();

  // Search for icons based on the query
  const searchIcon = async () => {
    if (query.trim() === "") {
      setSuggestions([]); // Clear suggestions when query is empty
      return;
    }

    setLoading(true);
    try {
      const response = await searchIcons(query, 5);
      if (!response.error) {
        setSuggestions(response.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching icons:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Call the searchIcon function when the query changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchIcon();
    }, 300); // Adding a debounce of 300ms before making the API call

    return () => clearTimeout(timeoutId); // Cleanup on component unmount or query change
  }, [query]);

  // Handle input change without affecting focus
  const handleInputChange = (event) => {
    const cursorPosition = event.target.selectionStart; // Save cursor position
    setQuery(event.target.value);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition); // Restore cursor position
      }
    }, 0);
  };

  // Keep the menu open as long as suggestions exist
  const handleMenuOpen = () => {
    if (suggestions.length > 0) {
      inputRef.current?.focus(); // Ensure the input remains focused
    }
  };

  // Close the menu when a suggestion is selected
  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.icon_name);
    setTimeout(() => inputRef.current?.focus(), 0); // Ensure cursor stays in the input
    router.push(`/home/icon/${suggestion.id}`);
    setSuggestions([]);
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <TextField
        inputRef={inputRef} // Ensure input retains focus
        value={query}
        onChange={handleInputChange}
        onFocus={handleMenuOpen} // Keep menu open when focusing back
        fullWidth
        variant="outlined"
        autoComplete="off"
      />

      <Menu
        anchorEl={inputRef.current} // Attach menu to the input field
        open={suggestions.length > 0} // Keep menu open if suggestions exist
        onClose={() => setSuggestions([])} // Close when clicking outside
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          suggestions.map((suggestion, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <ListItemText primary={suggestion.icon_name} />
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
};

export default SearchComponent;
