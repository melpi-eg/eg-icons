"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Stack,
  TextField,
  DialogActions,
  Alert,
  Tooltip,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PublishIcon from "@mui/icons-material/Publish";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publishIcons, scheduleIcons } from "@/api/icons";
import { all } from "axios";

export default function PublishModal({ open, onClose, icons, iconMetadata }) {
  const router = useRouter();
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  ); // Default to 1 hour from now
  const [publishing, setPublishing] = useState({});
  const [publishStatus, setPublishStatus] = useState({});
  const [alert, setAlert] = useState(null);
  const [allPublished, setAllPublished] = useState(false);

  console.log("Publishable", icons);

  useEffect(() => {
    if (!allPublished && Object.keys(publishStatus).length === icons.length) {
      let allPublishedFlag = true;

      icons.forEach((icon) => {
        if (
          publishStatus[icon.id] != "published" &&
          publishStatus[icon.id] != "scheduled"
        ) {
          allPublishedFlag = false;
        }
      });

      console.log("All Published", allPublishedFlag);

      setAllPublished(allPublishedFlag);
    }
  }, [publishStatus]);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedIcons(icons.map((icon) => icon.id));
    } else {
      setSelectedIcons([]);
    }
  };

  const handleIconSelect = (iconId, checked) => {
    setSelectedIcons((prev) => {
      const newSelection = checked
        ? [...prev, iconId]
        : prev.filter((id) => id !== iconId);
      setSelectAll(newSelection.length === icons.length);
      return newSelection;
    });
  };

  const handlePublish = async (iconId) => {
    if (!scheduleMode) {
      const icon = icons.find((i) => i.id === iconId);
      setPublishing((prev) => ({ ...prev, [iconId]: true }));
      // Publish API call :

      publishIcons([iconId], "PUBLISHED").then((response) => {
        if (!response.error) {
          setPublishing((prev) => ({ ...prev, [iconId]: false }));
          setPublishStatus((prev) => ({
            ...prev,
            [iconId]: scheduleMode ? "scheduled" : "published",
          }));

          setAlert({
            severity: "success",
            message: `${icon.name} has been ${
              scheduleMode ? "scheduled" : "published"
            } successfully`,
          });
        } else {
          setAlert({
            severity: "error",
            message: `Error publishing ${icon.name}`,
          });
        }
      });
    } else {
      const icon = icons.find((i) => i.id === iconId);
      setPublishing((prev) => ({ ...prev, [iconId]: true }));

      // schedule API call :
      scheduleIcons([iconId], scheduledDate).then((response) => {
        if (!response.error) {
          setPublishing((prev) => ({ ...prev, [iconId]: false }));
          setPublishStatus((prev) => ({
            ...prev,
            [iconId]: scheduleMode ? "scheduled" : "published",
          }));

          setAlert({
            severity: "success",
            message: `${icon.name} has been ${
              scheduleMode ? "scheduled" : "published"
            } successfully`,
          });
        } else {
          setAlert({
            severity: "error",
            message: `Error publishing ${icon.name}`,
          });
        }
      });
    }

    // await new Promise((resolve) => setTimeout(resolve, 1500));
    // setPublishing((prev) => ({ ...prev, [iconId]: false }));
    // setPublishStatus((prev) => ({
    //   ...prev,
    //   [iconId]: scheduleMode ? "scheduled" : "published",
    // }));

    // // Show alert message
    // const icon = icons.find((i) => i.id === iconId);
    // setAlert({
    //   severity: "success",
    //   message: `${icon.name} has been ${
    //     scheduleMode ? "scheduled" : "published"
    //   } successfully`,
    // });
  };

  const handleBulkPublish = async () => {
    const action = scheduleMode ? "scheduled" : "published";

    if (action === "published") {
      setAlert({
        severity: "info",
        message: `Publishing ${selectedIcons.length} icons...`,
      });

      // Update publish status to publishing to all the selected unpublished icons :
      setPublishing((prev) => {
        const newState = { ...prev };
        selectedIcons.forEach((iconId) => {
          if (!newState[iconId]) newState[iconId] = false;
        });
        return newState;
      });

      publishIcons(selectedIcons, "PUBLISHED").then((response) => {
        if (!response.error) {
          setAlert({
            severity: "success",
            message: `Published ${selectedIcons.length} icons successfully`,
          });

          setPublishStatus((prev) => {
            const newState = { ...prev };
            selectedIcons.forEach((iconId) => {
              newState[iconId] = scheduleMode ? "scheduled" : "published";
            });
            return newState;
          });

          setSelectedIcons([]);
          setSelectAll(false);
        } else {
          setAlert({
            severity: "error",
            message: `Error publishing ${selectedIcons.length} icons`,
          });
        }
      });
    } else {
      setAlert({
        severity: "info",
        message: `Scheduling ${selectedIcons.length} icons...`,
      });

      // Update publish status to publishing to all the selected unpublished icons :
      setPublishing((prev) => {
        const newState = { ...prev };
        selectedIcons.forEach((iconId) => {
          if (!newState[iconId]) newState[iconId] = false;
        });
        return newState;
      });

      scheduleIcons(selectedIcons, scheduledDate).then((response) => {
        if (!response.error) {
          setAlert({
            severity: "success",
            message: `Scheduled ${selectedIcons.length} icons successfully`,
          });

          setPublishStatus((prev) => {
            const newState = { ...prev };
            selectedIcons.forEach((iconId) => {
              newState[iconId] = scheduleMode ? "scheduled" : "published";
            });
            return newState;
          });

          setSelectedIcons([]);
          setSelectAll(false);
        } else {
          setAlert({
            severity: "error",
            message: `Error publishing ${selectedIcons.length} icons`,
          });
        }
      });
    }
  };

  const handleClose = () => {
    onClose();
    router.push("/home/manage");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Publish Icons</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {alert && (
          <Alert
            severity={alert.severity}
            sx={{ mb: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAll}
                  indeterminate={
                    selectedIcons.length > 0 &&
                    selectedIcons.length < icons.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              }
              label="Select All"
            />
            <Typography color="text.secondary">
              {selectedIcons.length} selected
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={scheduleMode}
                  onChange={(e) => setScheduleMode(e.target.checked)}
                />
              }
              label="Schedule Publish"
            />
            {scheduleMode && (
              <TextField
                type="datetime-local"
                size="small"
                label="Schedule Date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().slice(0, 16),
                }}
              />
            )}
          </Stack>

          {selectedIcons.length > 0 && allPublished && (
            <Button
              variant="contained"
              startIcon={scheduleMode ? <ScheduleIcon /> : <PublishIcon />}
              onClick={handleBulkPublish}
              sx={{ mb: 2 }}
            >
              {scheduleMode ? "Schedule Selected" : "Publish Selected"}
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          {icons.map((icon) => {
            const metadata = iconMetadata.find((m) => m.id === icon.id);
            return (
              <Grid item xs={12} key={icon.id}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  {/* Icon Preview */}
                  <Box sx={{ width: 60 }}>
                    <img
                      src={icon.preview}
                      alt={icon.name}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Box>

                  {/* Icon Details */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Checkbox
                        checked={selectedIcons.includes(icon.id)}
                        onChange={(e) =>
                          handleIconSelect(icon.id, e.target.checked)
                        }
                      />
                      <Typography variant="subtitle1">{icon.name}</Typography>
                    </Box>

                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Categories:
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Type:
                        </Typography>
                        <Chip
                          label={metadata?.iconType?.label}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tags:
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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
                    </Stack>
                  </Box>

                  {/* Publish Button */}
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={
                      scheduleMode ? <ScheduleIcon /> : <PublishIcon />
                    }
                    onClick={() => handlePublish(icon.id)}
                    disabled={
                      publishing[icon.id] ||
                      publishStatus[icon.id] ||
                      (selectedIcons.length > 0 &&
                        !selectedIcons.includes(icon.id))
                    }
                  >
                    {publishing[icon.id]
                      ? "Publishing..."
                      : publishStatus[icon.id] === "published"
                      ? "Published"
                      : publishStatus[icon.id] === "scheduled"
                      ? "Scheduled"
                      : scheduleMode
                      ? "Schedule"
                      : "Publish"}
                  </Button>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
