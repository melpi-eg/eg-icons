"use client";
import {
  Typography,
  Box,
  Grid,
  Card,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import { useState, useEffect } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";
import Pagination from "@mui/material/Pagination";
import IconModal from "../components/IconModal";
import {
  filterIconsByCategories,
  filterIconsByTags,
  getIcons,
} from "@/api/icons";
import { downloadIcon } from "@/api/downloads";
import { useSearchParams } from "next/navigation";
import { set } from "date-fns";
import { Snackbar, Alert } from "@mui/material";
import { useSelector } from "react-redux";

// Add this constant at the top of the file
const HEADER_HEIGHT = 64; // Assuming header height is 64px
const SIDEBAR_WIDTH = 240; // Sidebar width

export default function Home() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [totalIcons, setTotalIcons] = useState(0);
  const iconsPerPage = 10;

  const [icons, setIcons] = useState([]);
  const category_id = Number(useSearchParams().get("category_id"));
  const tag_id = Number(useSearchParams().get("tag_id"));
  console.log("--", category_id);
  const startValue = (currentPage - 1) * iconsPerPage + 1;
  const endValue = startValue + icons.length - 1;
  const category_name = useSelector(
    (state) =>
      state.categories.categories.find(
        (category) => category.id === category_id
      )?.name
  );

  // fetch the icons from the API :
  useEffect(() => {
    if (!category_id && !tag_id) {
      getIcons(currentPage, iconsPerPage).then((response) => {
        setIcons(
          response.data.icons
            .filter((icon) => icon.status === "PUBLISHED")
            .map((icon) => ({
              id: icon.id,
              className: "fa-shield-cross",
              tags: icon.icon_tags.map((tag) => tag.tag_name),
              name: icon.icon_name,
              svg: icon.icon_content,
            }))
        );
        setTotalIcons(response.data.totalCount);
        setPageCount(Math.ceil(response.data.totalCount / iconsPerPage));
      });
    }
  }, [iconsPerPage, currentPage, category_id]);

  // fetch filtered icons from the API when the category_id is provided
  useEffect(() => {
    if (category_id) {
      filterIconsByCategories(currentPage, iconsPerPage, [category_id]).then(
        (response) => {
          if (!response.error) {
            setIcons(
              response.data.icons.map((icon) => ({
                id: icon.id,
                className: "fa-shield-cross",
                tags: icon.icon_tags.map((tag) => tag.tag_name),
                name: icon.icon_name,
                svg: icon.icon_content,
              }))
            );
            setTotalIcons(response.data.totalCount);
            setPageCount(Math.ceil(response.data.totalCount / iconsPerPage));
          }
        }
      );
    }
  }, [category_id, iconsPerPage, currentPage]);

  // fetch filtered icons from the API when the tag_id is provided
  useEffect(() => {
    if (tag_id) {
      filterIconsByTags(currentPage, iconsPerPage, [tag_id]).then(
        (response) => {
          if (!response.error) {
            setIcons(
              response.data.icons.map((icon) => ({
                id: icon.id,
                className: "fa-shield-cross",
                tags: icon.icon_tags.map((tag) => tag.tag_name),
                name: icon.icon_name,
                svg: icon.icon_content,
              }))
            );
            setTotalIcons(response.data.totalCount);
            setPageCount(Math.ceil(response.data.totalCount / iconsPerPage));
          }
        }
      );
    }
  }, [tag_id, iconsPerPage, currentPage]);

  useEffect(() => {
    if (category_id) {
      setCurrentPage(1);
    }
  }, [category_id]);

  // Add search functionality
  const filteredIcons = icons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );
  console.log(filteredIcons);

  // Add empty state for search
  const noResults = searchQuery && filteredIcons.length === 0;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Pagination logic
  const indexOfLastIcon = currentPage * iconsPerPage;
  const indexOfFirstIcon = indexOfLastIcon - iconsPerPage;
  const currentIcons = icons;
  const [pageCount, setPageCount] = useState(0);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const IconSkeleton = () => (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" sx={{ borderRadius: 1 }} />
      </Card>
    </Grid>
  );

  // Add this effect after the other state declarations
  useEffect(() => {
    // setCurrentPage(1);
  }, [searchQuery]);

  // Add SVG loading functionality
  const loadSvgIcon = async (icon) => {
    if (icon.svg) {
      try {
        const response = await fetch(icon.svg);
        const svgText = await response.text();
        return svgText;
      } catch (error) {
        console.error("Error loading SVG:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        p: { xs: 2, md: 4 },
        pt: {
          xs: `calc(${HEADER_HEIGHT}px + 16px)`,
          md: `calc(${HEADER_HEIGHT}px + 24px)`,
        },
        ml: { sm: `${SIDEBAR_WIDTH}px` },
        width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
        zIndex: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 900,
            mb: 1,
            background: "linear-gradient(135deg, #0062ff 0%, #00a3ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          {category_name ? category_name.charAt(0).toUpperCase() + category_name.slice(1) : "All"} Icons
        </Typography>

        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 4,
            mb: 6,
            position: "relative",
          }}
        >
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search icons..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(31, 41, 55, 0.7)"
                    : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 24px rgba(0, 0, 0, 0.2)"
                    : "0 4px 24px rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(31, 41, 55, 0.9)"
                      : "rgba(255, 255, 255, 0.95)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 28px rgba(0, 0, 0, 0.3)"
                      : "0 4px 28px rgba(0, 0, 0, 0.08)",
                },
                "&.Mui-focused": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(31, 41, 55, 1)"
                      : "#ffffff",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 32px rgba(0, 0, 0, 0.4)"
                      : "0 4px 32px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />
        </Box>
      </motion.div>

      {/* Empty State */}
      {noResults ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            No icons found for "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try searching with different keywords or browse all icons
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSearchQuery("")}
            sx={{ mt: 3 }}
          >
            Clear Search
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {loading
              ? // Show skeletons while loading
                Array.from(new Array(24)).map((_, index) => (
                  <IconSkeleton key={index} />
                ))
              : filteredIcons.map((icon, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={icon.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card
                        onMouseEnter={() => setHoveredIcon(icon.id)}
                        onMouseLeave={() => setHoveredIcon(null)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 4,
                          cursor: "pointer",
                          background: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(31, 41, 55, 0.7)"
                              : "rgba(255, 255, 255, 0.7)",
                          border: (theme) =>
                            `1px solid ${
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(255,255,255,0.7)"
                            }`,
                          borderRadius: "16px",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            background: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(31, 41, 55, 0.95)"
                                : "rgba(255, 255, 255, 0.95)",
                            boxShadow: "0 8px 32px rgba(0, 98, 255, 0.12)",
                            "& .icon": {
                              color: "#0062ff",
                              transform: "scale(1.1)",
                            },
                          },
                        }}
                        onClick={() => setSelectedIcon(icon)}
                      >
                        <Box
                          className="icon"
                          sx={{
                            width: "3rem",
                            height: "4rem",
                            mb: 2,
                            transition: "all 0.3s ease",
                            color: (theme) =>
                              hoveredIcon === icon.id
                                ? theme.palette.primary.main
                                : theme.palette.mode === "dark"
                                ? "#fff"
                                : "#64748b",
                          }}
                        >
                          {icon.svg ? (
                            <Box
                              component="div"
                              dangerouslySetInnerHTML={{ __html: icon.svg }}
                              sx={{
                                width: "100%",
                                height: "100%",
                                "& svg": {
                                  width: "100%",
                                  height: "100%",
                                  "& path": {
                                    fill: "white",
                                  },
                                },
                              }}
                            />
                          ) : (
                            <i
                              className={`fas ${icon.className}`}
                              style={{ fontSize: "20rem" }}
                            />
                          )}
                        </Box>

                        <Typography
                          variant="caption"
                          align="center"
                          sx={{
                            fontWeight: 500,
                            color: (theme) =>
                              hoveredIcon === icon.id
                                ? theme.palette.primary.main
                                : theme.palette.mode === "dark"
                                ? "#fff"
                                : "#64748b",
                            transition: "color 0.3s ease",
                            textTransform: "capitalize",
                          }}
                        >
                          {icon.name}
                        </Typography>

                        {/* Quick action buttons */}
                        {hoveredIcon === icon.id && (
                          <Box
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              p: 1,
                              background:
                                "linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0))",
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: "white",
                                boxShadow: "0 2px 8px rgba(0, 98, 255, 0.08)",
                                "&:hover": {
                                  bgcolor: "#f8faff",
                                },
                              }}
                              onClick={() => {
                                navigator.clipboard
                                  .writeText(icon.svg)
                                  .then(() => {
                                    setSnackbar({
                                      open: true,
                                      message: "SVG copied to clipboard",
                                      severity: "success",
                                    });
                                  });
                              }}
                            >
                              <ContentCopyIcon
                                fontSize="small"
                                sx={{ color: "#0062ff" }}
                              />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: "white",
                                boxShadow: "0 2px 8px rgba(0, 98, 255, 0.08)",
                                "&:hover": {
                                  bgcolor: "#f8faff",
                                },
                              }}
                              onClick={() => {
                                downloadIcon(
                                  icon.svg,
                                  "svg",
                                  icon.name,
                                  icon.id
                                );
                              }}
                            >
                              <DownloadIcon
                                fontSize="small"
                                sx={{ color: "#0062ff" }}
                              />
                            </IconButton>
                          </Box>
                        )}
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
            {icons.length === 0 && (
              <Box sx={{ m: "auto", fontSize: "1.5rem" }}>
                No icons found in the category
              </Box>
            )}
          </Grid>

          {/* Pagination */}
          {!loading && !noResults && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 6,
                mb: 4,
              }}
            >
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    bgcolor: "background.paper",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Results count */}
          {!loading && !noResults && (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              {/* Showing {indexOfFirstIcon + 1}-
              {Math.min(indexOfLastIcon, filteredIcons.length)} of{" "}
              {filteredIcons.length} icons Showing{" "} */}
              {startValue} - {endValue} of {totalIcons} icons
            </Typography>
          )}
        </>
      )}

      {selectedIcon && (
        <IconModal
          selectedIcon={selectedIcon}
          onClose={() => setSelectedIcon(null)}
          setIcons={setIcons}
        />
      )}

      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
