"use client";
import {
  Typography,
  Box,
  Modal,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Slider,
  TextField,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import PaletteIcon from "@mui/icons-material/Palette";
import StraightenIcon from "@mui/icons-material/Straighten";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { downloadIcon } from "@/api/downloads";
import { useSelector } from "react-redux";
import { deleteIcons, publishIcons } from "@/api/icons";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1200,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
  borderRadius: 4,
  p: 0,
  outline: "none",
  overflow: "hidden",
};

const presetColors = [
  { hex: "#2c3e50", name: "Navy" },
  { hex: "#6c8c96", name: "Slate" },
  { hex: "#345c49", name: "Forest" },
  { hex: "#4f8b50", name: "Green" },
  { hex: "#7b9e5f", name: "Sage" },
  { hex: "#5d5245", name: "Brown" },
  { hex: "#796c64", name: "Taupe" },
  { hex: "#b38600", name: "Gold" },
  { hex: "#d75a2c", name: "Orange" },
];

const downloadFormats = [
  { format: "svg", label: "SVG", sizes: ["Original"] },
  {
    format: "png",
    label: "PNG",
    sizes: ["32px", "64px", "128px", "256px", "512px"],
  },
  { format: "pdf", label: "PDF", sizes: ["Original"] },
  // { format: "eps", label: "EPS", sizes: ["Original"] },
];

const sizeMarks = [
  { value: 32, label: "32" },
  { value: 64, label: "64" },
  { value: 128, label: "128" },
  { value: 256, label: "256" },
  { value: 512, label: "512" },
];

export default function IconModal({ selectedIcon, onClose, isAdmin = true }) {
  const theme = useTheme();
  const [iconColor, setIconColor] = useState("#000000");
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [iconSize, setIconSize] = useState(256);
  const [selectedFormat, setSelectedFormat] = useState("svg");
  const [strokeWidth, setStrokeWidth] = useState(0.5);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPngSize, setSelectedPngSize] = useState("256px");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [svgString, setSvgString] = useState(selectedIcon.svg);
  const user = useSelector((state) => state.auth.user);
  isAdmin = user.role === "SUPERADMIN" || user.role === "ADMIN";

  useEffect(() => {
    // Replace stroke color
    let tempSvg = svgString.replace(
      /stroke:\s*#[0-9a-fA-F]+;/,
      `stroke:${iconColor};`
    );

    // Replace stroke width
    tempSvg = tempSvg.replace(
      /stroke-width:\s*[^;]+;/,
      `stroke-width:${strokeWidth};`
    );

    // Update width in the svg tag
    tempSvg = tempSvg.replace(/width="\d+(\.\d+)?"/, `width="${iconSize}"`);

    // Update height in the svg tag
    tempSvg = tempSvg.replace(/height="\d+(\.\d+)?"/, `height="${iconSize}"`);

    // Regex to match all <path> elements and their 'fill' attributes
    const pathRegex = /<path([^>]*)>/gi;

    tempSvg = tempSvg.replace(pathRegex, (match, pathContent) => {
      // Remove existing inline styles that set the fill color
      pathContent = pathContent.replace(/style="fill:[^"]*"/, "");

      // If the path already has a fill attribute, replace it
      if (pathContent.includes('fill="')) {
        return match.replace(/fill="[^"]*"/, `fill="${iconColor}"`);
      }

      // Otherwise, add the fill attribute
      return match.replace("<path", `<path fill="${iconColor}"`);
    });

    setSvgString(tempSvg);
  }, [iconColor, iconSize, strokeWidth]);

  const handleDownloadClick = () => {
    downloadIcon(svgString, selectedFormat, selectedIcon.name, selectedIcon.id);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleColorChange = (newColor) => {
    setIconColor(newColor);
    setSnackbar({
      open: true,
      message: "Color updated",
      severity: "success",
    });
  };

  const handleSizeChange = (event, newValue) => {
    setIconSize(newValue);
    setSnackbar({
      open: true,
      message: `Size changed to ${newValue}px`,
      severity: "success",
    });
  };

  const handleStrokeChange = (event, newValue) => {
    setStrokeWidth(newValue);
    setSnackbar({
      open: true,
      message: `Stroke width updated to ${newValue}`,
      severity: "success",
    });
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    setSnackbar({
      open: true,
      message: `Format changed to ${format.toUpperCase()}`,
      severity: "success",
    });
  };

  const handlePngSizeChange = (size) => {
    setSelectedPngSize(size);
    setSnackbar({
      open: true,
      message: `PNG size set to ${size}`,
      severity: "success",
    });
  };

  const handleDelete = async () => {
    deleteIcons([selectedIcon.id]).then((response) => {
      if (response.error) {
        setSnackbar({
          open: true,
          message: "Error deleting icon",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Icon deleted successfully",
          severity: "success",
        });
        onClose();
      }
    });
  };

  const handleUnpublish = async () => {
    publishIcons(
      [selectedIcon.id],
      selectedIcon.status == "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED"
    ).then((response) => {
      if (response.error) {
        setSnackbar({
          open: true,
          message: "Error unpublishing icon",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Icon unpublished successfully",
          severity: "success",
        });
      }
    });
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(svgString).then(() => {
      setSnackbar({
        open: true,
        message: "SVG copied to clipboard",
        severity: "success",
      });
    });
  };

  return (
    <>
      <Modal open={true} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            maxWidth: 1400,
            maxHeight: "90vh",
            bgcolor:
              theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
            borderRadius: 2,
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: 1,
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "grey.200",
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.mode === "dark" ? "grey.100" : "grey.800",
              }}
            >
              {selectedIcon.name}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              onClick={onClose}
              sx={{
                color: theme.palette.mode === "dark" ? "grey.400" : "grey.600",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 350px" },
              height: "calc(90vh - 140px)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Preview Section */}
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                borderRight: { xs: 0, md: 1 },
                borderBottom: { xs: 1, md: 0 },
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "grey.200",
                overflow: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 6,
                  bgcolor: "#ffffff",
                  borderRadius: 2,
                  minHeight: "400px",
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 24px rgba(0,0,0,0.2)"
                      : "0 4px 24px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    color: iconColor,
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Icon content */}
                  {selectedIcon.svg ? (
                    <Box
                      component="div"
                      dangerouslySetInnerHTML={{ __html: svgString }}
                    />
                  ) : (
                    <i
                      className={`fas ${selectedIcon.className}`}
                      style={{ fontSize: `${iconSize}px` }}
                    />
                  )}
                </Box>
              </Box>

              {/* Tags */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color:
                      theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                  }}
                >
                  Tags
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {selectedIcon.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "grey.100",
                        color:
                          theme.palette.mode === "dark"
                            ? "grey.300"
                            : "grey.700",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Settings Section */}
            <Box
              sx={{
                p: 3,
                overflow: "auto",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.02)"
                    : "grey.50",
              }}
            >
              {/* Color Settings */}
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  color:
                    theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                }}
              >
                EG Colors
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  {presetColors.map((color) => (
                    <Tooltip key={color.hex} title={color.name}>
                      <Box
                        onClick={() => handleColorChange(color.hex)}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: color.hex,
                          borderRadius: 1,
                          cursor: "pointer",
                          border:
                            iconColor === color.hex
                              ? "2px solid"
                              : "2px solid transparent",
                          borderColor: theme.palette.primary.main,
                          "&:hover": { transform: "scale(1.1)" },
                          transition: "all 0.2s ease",
                        }}
                      />
                    </Tooltip>
                  ))}
                  <Tooltip title="Custom Color">
                    <Box
                      onClick={() => setShowCustomColor(!showCustomColor)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        cursor: "pointer",
                        border: "2px dashed",
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "grey.600"
                            : "grey.300",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": { borderColor: theme.palette.primary.main },
                      }}
                    >
                      <PaletteIcon
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? "grey.400"
                              : "grey.600",
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
                {showCustomColor && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      size="small"
                      value={iconColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="#000000"
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "grey.50",
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: "relative",
                        width: 40,
                        height: 40,
                        overflow: "hidden",
                        borderRadius: 1,
                        border: (theme) =>
                          `1px solid ${
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(0,0,0,0.1)"
                          }`,
                      }}
                    >
                      <input
                        type="color"
                        value={iconColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        style={{
                          width: "50px",
                          height: "50px",
                          position: "absolute",
                          top: "-5px",
                          left: "-5px",
                          padding: 0,
                          margin: 0,
                          border: "none",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Size Settings */}
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  mt: 4,
                  color:
                    theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                }}
              >
                Size
              </Typography>
              <Box sx={{ px: 2, mb: 4, mt: 3 }}>
                <Slider
                  value={iconSize}
                  onChange={handleSizeChange}
                  min={32}
                  max={512}
                  step={null}
                  marks={sizeMarks}
                  valueLabelDisplay="auto"
                  sx={{
                    "& .MuiSlider-mark": {
                      height: "8px",
                    },
                    "& .MuiSlider-markLabel": {
                      fontSize: "0.75rem",
                      transform: "translateX(-50%) translateY(20px)",
                      '&[data-index="0"]': {
                        transform: "translateX(0%) translateY(20px)",
                      },
                      '&[data-index="4"]': {
                        transform: "translateX(-100%) translateY(20px)",
                      },
                    },
                  }}
                />
              </Box>

              {/* Stroke Width */}
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  mt: 4,
                  color:
                    theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                }}
              >
                Stroke Width
              </Typography>
              <Box sx={{ px: 2, mb: 4 }}>
                <Slider
                  value={strokeWidth}
                  onChange={handleStrokeChange}
                  min={0.5}
                  max={4}
                  step={null}
                  marks={[
                    { value: 0.5, label: "0.5" },
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                    { value: 3, label: "3" },
                    { value: 4, label: "4" },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              {/* Download Format */}
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  mt: 4,
                  color:
                    theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                }}
              >
                Download Format
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {downloadFormats.map((format) => (
                  <Chip
                    key={format.format}
                    label={format.label}
                    onClick={() => handleFormatChange(format.format)}
                    variant={
                      selectedFormat === format.format ? "filled" : "outlined"
                    }
                    sx={{
                      bgcolor:
                        selectedFormat === format.format
                          ? theme.palette.mode === "dark"
                            ? "primary.dark"
                            : "primary.main"
                          : "transparent",
                      color:
                        selectedFormat === format.format
                          ? "#fff"
                          : theme.palette.mode === "dark"
                          ? "grey.300"
                          : "grey.700",
                    }}
                  />
                ))}
              </Box>

              {/* PNG Size Options */}
              {selectedFormat === "png" && (
                <Box sx={{ mt: 2, mb: 4 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "grey.400" : "grey.600",
                      fontSize: "0.75rem",
                    }}
                  >
                    Select Size
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {downloadFormats
                      .find((format) => format.format === "png")
                      .sizes.map((size) => (
                        <Chip
                          key={size}
                          label={size}
                          onClick={() => handlePngSizeChange(size)}
                          variant={
                            selectedPngSize === size ? "filled" : "outlined"
                          }
                          size="small"
                          sx={{
                            bgcolor:
                              selectedPngSize === size
                                ? theme.palette.mode === "dark"
                                  ? "primary.dark"
                                  : "primary.main"
                                : "transparent",
                            color:
                              selectedPngSize === size
                                ? "#fff"
                                : theme.palette.mode === "dark"
                                ? "grey.300"
                                : "grey.700",
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.2)"
                                : undefined,
                            "&:hover": {
                              bgcolor:
                                selectedPngSize === size
                                  ? theme.palette.mode === "dark"
                                    ? "primary.dark"
                                    : "primary.main"
                                  : theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.05)"
                                  : "grey.100",
                            },
                          }}
                        />
                      ))}
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "primary.dark"
                        : "primary.main",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "primary.dark",
                    },
                    whiteSpace: "nowrap",
                    minHeight: 48,
                  }}
                  onClick={handleDownloadClick}
                >
                  Download {selectedFormat.toUpperCase()}
                  {selectedFormat === "png" && ` (${selectedPngSize})`}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.2)"
                        : undefined,
                    color:
                      theme.palette.mode === "dark" ? "grey.300" : undefined,
                    "&:hover": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.3)"
                          : undefined,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : undefined,
                    },
                  }}
                  onClick={handleCopyClick}
                >
                  Copy SVG
                </Button>

                {/* Admin-only buttons */}
                {isAdmin && (
                  <>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        borderColor: theme.palette.warning.main,
                        color: theme.palette.warning.main,
                        "&:hover": {
                          borderColor: theme.palette.warning.dark,
                          bgcolor: "rgba(237, 108, 2, 0.04)",
                        },
                      }}
                      onClick={handleUnpublish}
                    >
                      Unpublish Icon
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        "&:hover": {
                          borderColor: theme.palette.error.dark,
                          bgcolor: "rgba(211, 47, 47, 0.04)",
                        },
                      }}
                      onClick={handleDelete}
                    >
                      Delete Icon
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {/* Snackbar inside modal */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={2000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                "& .MuiSnackbarContent-root": {
                  minWidth: "auto",
                },
              }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbar.severity}
                sx={{
                  width: "100%",
                  bgcolor:
                    theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                  color:
                    theme.palette.mode === "dark" ? "grey.100" : "grey.800",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 4px 12px rgba(0,0,0,0.4)"
                      : "0 4px 12px rgba(0,0,0,0.1)",
                  "& .MuiAlert-icon": {
                    color:
                      theme.palette.mode === "dark"
                        ? "primary.light"
                        : "primary.main",
                  },
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
