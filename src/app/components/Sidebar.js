"use client";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactsIcon from "@mui/icons-material/Contacts";
import CategoryIcon from "@mui/icons-material/Category";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import NatureIcon from "@mui/icons-material/Nature";
import DevicesIcon from "@mui/icons-material/Devices";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadIcon from "@mui/icons-material/Upload";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import Link from "next/link";
import { useEffect } from "react";
import ClassIcon from "@mui/icons-material/Class";
import { getCategories } from "@/api/categories";
import { useSelector } from "react-redux";
import useRole from "@/hooks/useRole";
import GroupIcon from "@mui/icons-material/Group";

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
  const [categories, setCategories] = useState([]);
  const { isAdmin, isSuperAdmin } = useRole();

  // fetch categories from the API:
  useEffect(() => {
    getCategories().then((response) =>
      setCategories(response.data.map((item) => item.category_name))
    );
  }, []);

  const drawer = (
    <div>
      <Toolbar />

      <Divider />
      <List>
        <ListItem>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        {categories.map((item) => (
          <ListItem key={item} disablePadding sx={{ pl: 2 }}>
            <ListItemButton>
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List>
        {[
          {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/home/manage",
            show: isAdmin,
          },
          {
            text: "Manage Icons",
            icon: <ManageSearchIcon />,
            path: "/home/manage/icons",
            show: isAdmin,
          },
          {
            text: "Manage Users",
            icon: <GroupIcon />,
            path: "/home/manage/users",
            show: isSuperAdmin,
          },
          {
            text: "Upload Icons",
            icon: <UploadIcon />,
            path: "/home/manage/upload",
            show: isAdmin,
          },
        ].map((item) => {
          if (!item.show) return null;
          return (
            <ListItem key={item.text} disablePadding>
              <Link
                href={item.path}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
