"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Grid,
  IconButton,
  Alert,
  Autocomplete,
  CircularProgress,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Container,
  FormControlLabel,
  Checkbox,
  Toolbar,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import PublishIcon from "@mui/icons-material/Publish";
import PublishModal from "../../../components/PublishModal";
import { uploadIcons } from "@/api/icons";
import { getCategories } from "@/api/categories";
import { getIconTypes } from "@/api/types";
import { generateTags } from "@/api/tags";
import useRole from "@/hooks/useRole";
import FullScreenUnauthorized from "@/app/components/Unauthorized";

// const categories = [
//   { id: "ui", label: "User Interface" },
//   { id: "social", label: "Social Media" },
//   { id: "business", label: "Business" },
//   { id: "tech", label: "Technology" },
//   { id: "communication", label: "Communication" },
//   { id: "weather", label: "Weather" },
//   { id: "transport", label: "Transportation" },
//   { id: "entertainment", label: "Entertainment" },
//   { id: "education", label: "Education" },
//   { id: "healthcare", label: "Healthcare" },
// ];

// const iconTypes = [
//   { id: "outline", label: "Outline" },
//   { id: "filled", label: "Filled" },
//   { id: "duotone", label: "Duotone" },
//   { id: "thin", label: "Thin" },
//   { id: "bold", label: "Bold" },
// ];

const steps = ["Upload Icons", "Add Categories", "Add Tags", "Review & Upload"];

const ActionsToolbar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  children,
  selectAll,
  hasPartialSelection,
}) => (
  <Paper
    elevation={0}
    sx={{
      mb: 3,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              indeterminate={hasPartialSelection}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          }
          label="Select All"
        />

        <Divider orientation="vertical" flexItem />

        <Typography color="inherit" variant="subtitle1" component="div">
          {selectedCount > 0
            ? `${selectedCount} selected of ${totalCount}`
            : `${totalCount} icons`}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {children}
      </Stack>
    </Toolbar>
  </Paper>
);

export default function AdminPanel() {
  const theme = useTheme();
  const drawerWidth = 240;

  const [activeStep, setActiveStep] = useState(0);
  const [icons, setIcons] = useState([]);
  const [iconMetadata, setIconMetadata] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [bulkCategory, setBulkCategory] = useState([]);
  const [bulkIconType, setBulkIconType] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [categories, setCategories] = useState([]);
  const [iconTypes, setIconTypes] = useState([]);
  const [uploadedIds, setUploadedIds] = useState([]);
  const { isAdmin } = useRole();

  // Fetch categories and types:
  useEffect(() => {
    // fetching the categories :
    getCategories().then((response) => {
      if (!response.error) {
        setCategories(
          response.data.map((category) => ({
            id: category.id,
            label: category.category_name,
          }))
        );
      }
    });

    // fetching the icon types :
    getIconTypes().then((response) => {
      if (!response.error) {
        setIconTypes(
          response.data.map((type) => ({
            id: type.id,
            label: type.type_name[0].toUpperCase() + type.type_name.slice(1),
          }))
        );
      }
    });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newIcon = {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          id: Math.random().toString(36).substr(2, 9),
          status: "pending",
          content: reader.result,
        };

        setIcons((prev) => [...prev, newIcon]);
        setIconMetadata((prev) => [
          ...prev,
          {
            id: newIcon.id,
            name: newIcon.name.replace(".svg", ""),
            categories: [],
            iconType: null,
            tags: [],
            autoGeneratedTags: false,
          },
        ]);
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/svg+xml": [".svg"],
    },
    multiple: true,
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleAutoGenerateTags = async (iconIds) => {
    // if only one icon is selected :
    if (!Array.isArray(iconIds) || iconIds.length === 1) {
      if (!Array.isArray(iconIds)) {
        iconIds = [iconIds];
      }

      const { data, error } = await generateTags(
        icons
          .filter((icon) => iconIds.includes(icon.id))
          .map((icon) => icon.name)
      );
      if (error) return;

      const aiGeneratedTag = data.tags;

      setIconMetadata((prev) =>
        prev.map((icon) => {
          if (iconIds.includes(icon.id)) {
            return {
              ...icon,
              tags: [...new Set([...icon.tags, ...aiGeneratedTag[0]])],
              autoGeneratedTags: true,
            };
          }
          return icon;
        })
      );

      return;
    }

    try {
      const { data, error } = await generateTags(
        icons
          .filter((icon) => iconIds.includes(icon.id))
          .map((icon) => icon.name)
      );
      if (error) return;

      // mapping the tags to the respective icon id so that it will be easy to update the state :
      const temp = {};
      const aiGeneratedTags = data.tags;

      iconIds.forEach((id, index) => {
        temp[id] = aiGeneratedTags[index];
      });

      // updating the state :
      setIconMetadata((prev) =>
        prev.map((icon, index) => {
          if (iconIds.includes(icon.id)) {
            return {
              ...icon,
              tags: [...new Set([...icon.tags, ...temp[icon.id]])],
              autoGeneratedTags: true,
            };
          }
          return icon;
        })
      );
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to generate tags",
        severity: "error",
      });
    }
  };

  const handleClearTags = (iconIds) => {
    if (!Array.isArray(iconIds)) {
      iconIds = [iconIds];
    }

    setIconMetadata((prev) =>
      prev.map((icon) => {
        if (iconIds.includes(icon.id)) {
          return {
            ...icon,
            tags: [],
            autoGeneratedTags: false,
          };
        }
        return icon;
      })
    );
  };

  const handleUpload = async () => {
    setUploading(true);

    uploadIcons(
      new Array(icons.length).fill().map((_, index) => {
        return {
          file: icons[index].file,
          tags: iconMetadata[index].tags.join(","),
          categories: iconMetadata[index].categories
            .map((category) => category.id)
            .join(","),
          iconType: iconMetadata[index].iconType?.id,
        };
      })
    ).then((response) => {
      if (!response.error) {
        // updating the icon id's after the upload :
        const tempIcons = [...icons];
        response.data.id.map((id, index) => {
          tempIcons[index].status = "completed";
          tempIcons[index].id = id;
        });

        setIcons(tempIcons);

        setUploadedIds(response.data.id.map((id, index) => id));
      } else {
        setAlert({
          show: true,
          message: "Upload failed",
          severity: "error",
        });
      }
    });

    try {
      for (const icon of icons) {
        if (icon.status !== "completed") {
          setUploadProgress((prev) => ({ ...prev, [icon.id]: 0 }));
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            setUploadProgress((prev) => ({ ...prev, [icon.id]: progress }));
          }
          setIcons((prev) =>
            prev.map((i) =>
              i.id === icon.id ? { ...i, status: "completed" } : i
            )
          );
        }
      }
      setUploadComplete(true);
      setAlert({
        show: true,
        message: "Upload complete!",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Upload failed",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setUploading(false);
    setUploadProgress({});
    setAlert({
      show: true,
      message: "Upload cancelled",
      severity: "info",
    });
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allIconIds = iconMetadata.map((icon) => icon.id);
      setSelectedIcons(allIconIds);
    } else {
      setSelectedIcons([]);
    }
  };

  const handleIconSelect = (iconId, checked) => {
    setSelectedIcons((prev) => {
      const newSelection = checked
        ? [...prev, iconId]
        : prev.filter((id) => id !== iconId);

      setSelectAll(newSelection.length === iconMetadata.length);
      return newSelection;
    });
  };

  if (!isAdmin) {
    return <FullScreenUnauthorized />;
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Paper
              {...getRootProps()}
              sx={{
                p: 6,
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : "grey.300",
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: isDragActive ? "action.hover" : "background.paper",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon
                sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? "Drop SVG files here" : "Drag & Drop SVG files"}
              </Typography>
              <Typography color="textSecondary">
                or click to select files
              </Typography>
            </Paper>

            {icons.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 4 }}>
                {icons.map((icon) => (
                  <Grid item xs={12} sm={6} md={4} key={icon.id}>
                    <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src={icon.preview}
                        sx={{ width: 40, height: 40, mr: 2 }}
                        alt={icon.name}
                      />
                      <Typography sx={{ flex: 1 }} noWrap>
                        {icon.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setIcons((prev) =>
                            prev.filter((i) => i.id !== icon.id)
                          );
                          setIconMetadata((prev) =>
                            prev.filter((i) => i.id !== icon.id)
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <ActionsToolbar
              selectedCount={selectedIcons.length}
              totalCount={iconMetadata.length}
              onSelectAll={handleSelectAll}
              onClearSelection={() => handleSelectAll(false)}
              selectAll={selectAll}
              hasPartialSelection={
                selectedIcons.length > 0 &&
                selectedIcons.length < iconMetadata.length
              }
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Autocomplete
                  sx={{ width: 400 }}
                  options={categories}
                  multiple
                  getOptionLabel={(option) => option.label}
                  value={bulkCategory}
                  onChange={(_, newValue) => {
                    setBulkCategory(newValue);
                    if (newValue) {
                      setIconMetadata((prev) =>
                        prev.map((icon) => {
                          if (selectedIcons.includes(icon.id)) {
                            return { ...icon, categories: newValue };
                          }
                          return icon;
                        })
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bulk Assign Categories"
                      size="small"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.label}
                        {...getTagProps({ index })}
                        key={option.id}
                        size="small"
                      />
                    ))
                  }
                />
                <Autocomplete
                  sx={{ width: 200 }}
                  options={iconTypes}
                  getOptionLabel={(option) => option.label}
                  value={bulkIconType}
                  onChange={(_, newValue) => {
                    setBulkIconType(newValue);
                    if (newValue) {
                      setIconMetadata((prev) =>
                        prev.map((icon) => {
                          if (selectedIcons.includes(icon.id)) {
                            return { ...icon, iconType: newValue };
                          }
                          return icon;
                        })
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bulk Icon Type"
                      size="small"
                    />
                  )}
                />
              </Stack>
            </ActionsToolbar>

            {iconMetadata.map((icon) => (
              <Paper key={icon.id} sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={icons.find((i) => i.id === icon.id)?.preview}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "contain",
                          mb: 1,
                        }}
                        alt={icon.name}
                      />
                      <Typography variant="subtitle2" align="center">
                        {icon.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={9}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedIcons.includes(icon.id)}
                              onChange={(e) =>
                                handleIconSelect(icon.id, e.target.checked)
                              }
                            />
                          }
                          label="Select Icon"
                        />
                      </Box>

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Autocomplete
                          multiple
                          sx={{ flex: 2 }}
                          options={categories}
                          getOptionLabel={(option) => option.label}
                          value={icon.categories}
                          onChange={(_, newValue) => {
                            setIconMetadata((prev) =>
                              prev.map((i) =>
                                i.id === icon.id
                                  ? { ...i, categories: newValue }
                                  : i
                              )
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Categories"
                              required
                              error={!icon.categories?.length}
                              helperText={
                                !icon.categories?.length
                                  ? "At least one category is required"
                                  : ""
                              }
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                label={option.label}
                                {...getTagProps({ index })}
                                key={option.id}
                              />
                            ))
                          }
                        />
                        <Autocomplete
                          sx={{ flex: 1 }}
                          options={iconTypes}
                          getOptionLabel={(option) => option.label}
                          value={icon.iconType}
                          onChange={(_, newValue) => {
                            setIconMetadata((prev) =>
                              prev.map((i) =>
                                i.id === icon.id
                                  ? { ...i, iconType: newValue }
                                  : i
                              )
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Icon Type"
                              required
                              error={!icon.iconType}
                              helperText={
                                !icon.iconType ? "Icon type is required" : ""
                              }
                            />
                          )}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <ActionsToolbar
              selectedCount={selectedIcons.length}
              totalCount={iconMetadata.length}
              onSelectAll={handleSelectAll}
              onClearSelection={() => handleSelectAll(false)}
              selectAll={selectAll}
              hasPartialSelection={
                selectedIcons.length > 0 &&
                selectedIcons.length < iconMetadata.length
              }
            >
              <Stack direction="row" spacing={2}>
                <Button
                  startIcon={<AutoFixHighIcon />}
                  onClick={() => {
                    const untaggedSelectedIcons = selectedIcons.filter(
                      (id) =>
                        !iconMetadata.find((icon) => icon.id === id)
                          ?.autoGeneratedTags
                    );
                    if (untaggedSelectedIcons.length > 0) {
                      handleAutoGenerateTags(untaggedSelectedIcons);
                    }
                  }}
                  disabled={selectedIcons.length === 0}
                  variant="contained"
                  size="small"
                >
                  Auto-Generate Tags
                </Button>
                <Button
                  startIcon={<ClearIcon />}
                  onClick={() => handleClearTags(selectedIcons)}
                  disabled={selectedIcons.length === 0}
                  variant="outlined"
                  color="error"
                  size="small"
                >
                  Clear Tags
                </Button>
              </Stack>
            </ActionsToolbar>

            {iconMetadata.map((icon) => (
              <Paper key={icon.id} sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={icons.find((i) => i.id === icon.id)?.preview}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "contain",
                          mb: 1,
                        }}
                        alt={icon.name}
                      />
                      <Typography variant="subtitle2" align="center">
                        {icon.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={9}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        gap: 2,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedIcons.includes(icon.id)}
                            onChange={(e) =>
                              handleIconSelect(icon.id, e.target.checked)
                            }
                          />
                        }
                        label="Select Icon"
                      />
                      <Button
                        startIcon={<AutoFixHighIcon />}
                        onClick={() => handleAutoGenerateTags(icon.id)}
                        disabled={icon.autoGeneratedTags}
                        size="small"
                        variant="contained"
                      >
                        Auto-Generate Tags
                      </Button>
                      <Button
                        onClick={() => handleClearTags(icon.id)}
                        disabled={icon.tags.length === 0}
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        Clear Tags
                      </Button>
                      {icon.autoGeneratedTags && (
                        <Chip
                          label="AI Generated"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={icon.tags}
                      onChange={(_, newValue) => {
                        setIconMetadata((prev) =>
                          prev.map((i) =>
                            i.id === icon.id ? { ...i, tags: newValue } : i
                          )
                        );
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                            sx={{
                              "& .MuiChip-label": {
                                maxWidth: "150px",
                              },
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Add Tags"
                          placeholder="Type and press enter"
                          helperText="Add custom tags or use auto-generate"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 4 }}>
            {icons.map((icon) => {
              const metadata = iconMetadata.find((m) => m.id === icon.id);
              return (
                <Paper key={icon.id} sx={{ p: 3, mb: 2 }}>
                  <Grid container spacing={3} alignItems="flex-start">
                    {/* Icon Preview */}
                    <Grid item xs={12} sm={3}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={icon.preview}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: "contain",
                            mb: 1,
                          }}
                          alt={icon.name}
                        />
                        <Typography variant="subtitle2" align="center">
                          {icon.name}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Metadata and Upload Status */}
                    <Grid item xs={12} sm={9}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {/* Categories */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Categories:
                          </Typography>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {metadata?.categories.map((category) => (
                              <Chip
                                key={category.id}
                                label={category.label}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Icon Type */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Icon Type:
                          </Typography>
                          <Chip
                            label={metadata?.iconType?.label}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        {/* Tags */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Tags:
                          </Typography>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {metadata?.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                color={
                                  metadata.autoGeneratedTags
                                    ? "primary"
                                    : "default"
                                }
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Upload Progress */}
                        <Box sx={{ mt: 2 }}>
                          {uploading && (
                            <>
                              <LinearProgress
                                variant="determinate"
                                value={uploadProgress[icon.id] || 0}
                                sx={{ mb: 1 }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {uploadProgress[icon.id]}% uploaded
                              </Typography>
                            </>
                          )}
                          {icon.status === "completed" && (
                            <Alert severity="success" sx={{ mt: 1 }}>
                              Upload complete
                            </Alert>
                          )}
                          {icon.status === "failed" && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              Upload failed
                            </Alert>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        ml: { sm: `${drawerWidth}px` },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        pt: { xs: 8, md: 10 },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Upload Icons
        </Typography>

        {alert.show && (
          <Alert
            severity={alert.severity}
            sx={{ mb: 3 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<NavigateBeforeIcon />}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              {!uploadComplete && (
                <Button
                  variant="contained"
                  onClick={uploading ? handleCancelUpload : handleUpload}
                  color={uploading ? "error" : "primary"}
                  startIcon={uploading ? <ClearIcon /> : null}
                  endIcon={!uploading ? <CloudUploadIcon /> : null}
                >
                  {uploading ? "Cancel Upload" : "Upload All Icons"}
                </Button>
              )}
              {(uploadComplete ||
                icons.some((icon) => icon.status === "completed")) && (
                <Button
                  variant="outlined"
                  onClick={() => setPublishModalOpen(true)}
                  startIcon={<PublishIcon />}
                >
                  Publish Icons
                </Button>
              )}
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNextIcon />}
              disabled={
                (activeStep === 0 && icons.length === 0) ||
                (activeStep === 1 &&
                  iconMetadata.some(
                    (icon) => !icon.categories.length || !icon.iconType
                  )) ||
                (activeStep === 2 &&
                  iconMetadata.some((icon) => icon.tags.length === 0))
              }
            >
              Next
            </Button>
          )}
        </Box>
      </Container>
      <PublishModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        icons={icons.filter((icon) => icon.status === "completed")}
        iconMetadata={iconMetadata}
      />
    </Box>
  );
}
