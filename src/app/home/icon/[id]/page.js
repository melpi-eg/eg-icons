"use client";
import { useState, use, useEffect } from "react";
import { Box, Typography, Slider, Button, Card, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { getSingleIcon } from "@/api/icons";

export default function IconDetail({ params }) {
  const router = useRouter();
  const [iconColor, setIconColor] = useState("#1976d2");
  const [iconSize, setIconSize] = useState(100);
  const [iconInfo, setIconInfo] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const id = use(params).id;

  // fetch the icon details :
  useEffect(() => {
    setIsLoaded(false);
    getSingleIcon(id).then((response) => {
      console.log(response.data);
      if (response.error) {
        console.error(response.error);
        return;
      }
      const icon_data = response.data;

      setIconInfo({
        icon_content: icon_data.icon_content,
        icon_name: icon_data.icon_name,
        icon_tags: icon_data.icon_tags.map((tag) => tag.tag_name),
        icon_categories: icon_data.icon_category.map(
          (category) => category.category_name
        ),
      });

      setIsLoaded(true);
    });
  }, [id]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 10 }}>
      <Button onClick={() => router.back()} sx={{ mb: 3 }} variant="outlined">
        Back to Icons
      </Button>

      <Card sx={{ p: 4, mb: 4, textAlign: "center" }}>
        <div dangerouslySetInnerHTML={{ __html: iconInfo.icon_content }}></div>
      </Card>

      <Typography variant="h6" gutterBottom>
        Customize Icon
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Color</Typography>
        <input
          type="color"
          value={iconColor}
          onChange={(e) => setIconColor(e.target.value)}
          style={{ width: "100%", height: "40px" }}
        />
      </Box>

      <Box>
        <Typography gutterBottom>Size</Typography>
        <Slider
          value={iconSize}
          onChange={(e, newValue) => setIconSize(newValue)}
          min={20}
          max={200}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}px`}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Icon Information
        </Typography>
        <Typography>Icon name: {iconInfo.icon_name}</Typography>
        <Typography>
          tags:{" "}
          {iconInfo.icon_tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Typography>
        <Typography>
          categories:{" "}
          {iconInfo.icon_categories.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Typography>
        <Typography>Current color: {iconColor}</Typography>
      </Box>
    </Box>
  );
}
