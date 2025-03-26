import SearchComponent from "@/app/components/IconSearch";
import React from "react";
import { Box } from "@mui/material";

function page() {
  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        mt: "64px",
        ml: "240px",
        width: "calc(100% - 240px)",
        paddingBlock: "auto",
        height: "50vh",
      }}
    >
      <SearchComponent />
    </Box>
  );
}

export default page;
