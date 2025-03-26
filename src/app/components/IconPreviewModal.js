import { Modal, Box, Stack, Typography, Chip } from "@mui/material";
import Image from "next/image";

function IconPreviewModal({ open, icon, onClose }) {
  if (!icon) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="icon-preview-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          color: "text.primary",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" component="h2" color="text.primary">
            {icon.name}
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: "300px",
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 1,
              bgcolor: "background.default",
            }}
          >
            <Image
              src={icon.iconUrl}
              alt={icon.name}
              fill
              style={{ objectFit: "contain", padding: "32px" }}
            />
          </Box>

          <Stack spacing={1}>
            <Typography color="text.primary">
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Category:
              </Box>{" "}
              {icon.category}
            </Typography>
            <Typography color="text.primary">
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Type:
              </Box>{" "}
              {icon.type}
            </Typography>
            <Typography color="text.primary">
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Date Uploaded:
              </Box>{" "}
              {icon.dateUploaded}
            </Typography>
            <Typography color="text.primary">
              <Box component="span" sx={{ fontWeight: "bold" }}>
                Downloads:
              </Box>{" "}
              {icon.downloads || 0}
            </Typography>
            <Box>
              <Typography
                component="span"
                color="text.primary"
                sx={{ fontWeight: "bold" }}
              >
                Tags:
              </Typography>{" "}
              {icon.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default IconPreviewModal;
