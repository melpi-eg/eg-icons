"use client";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import BrandIcon from "@mui/icons-material/BrandingWatermark";
import SportsIcon from "@mui/icons-material/Sports";
import Astronomy from "@mui/icons-material/Sports";

export const getCategoryIcon = (category) => {
  category = category.toLowerCase().trim();

  switch (category) {
    case "emotions":
      return <EmojiEmotionsIcon />;
    case "activities":
      return <LocalActivityIcon />;
    case "brands":
      return <BrandIcon />;
    case "astronomy":
      return <Astronomy />;
    case "sports":
      return <SportsIcon />;
    default:
      break;
  }
};
