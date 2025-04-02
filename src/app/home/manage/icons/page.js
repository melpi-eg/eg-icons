"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  MenuItem,
  Alert,
  Snackbar,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadIcon from "@mui/icons-material/Upload";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import PreviewIcon from "@mui/icons-material/Preview";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import IconPreviewModal from "@/app/components/IconPreviewModal";
import {
  addIconType,
  deleteIconTypes,
  getIconTypes,
  updateIconType,
} from "@/api/types";
import {
  addCategory,
  deleteCategories,
  getCategories,
  updateCategory,
} from "@/api/categories";
import { deleteIcons, getIcons, publishIcons, updateIcon } from "@/api/icons";
import { createSvgUrlFromCode } from "@/utils";
import FullScreenUnauthorized from "@/app/components/Unauthorized";
import useRole from "@/hooks/useRole";
import { useDispatch } from "react-redux";
import { setCategories as setCategoriesAction } from "@/store/reducers/categoriesSlice";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ManagePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [iconTypes, setIconTypes] = useState([]);
  const [newItemDialog, setNewItemDialog] = useState({
    open: false,
    type: null,
  });
  const [newItemName, setNewItemName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [editDialog, setEditDialog] = useState({
    open: false,
    icon: null,
    error: {
      category: false,
      tags: false,
    },
  });
  const [editedCategory, setEditedCategory] = useState("");
  const [editedTags, setEditedTags] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    published: "all",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null,
    type: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selected, setSelected] = useState([]);
  const [previewModal, setPreviewModal] = useState({ open: false, icon: null });
  const [newIconType, setNewIconType] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [totalIcons, setTotalIcons] = useState(0);
  const [editCategoryType, setEditCategoryType] = useState({
    open: false,
    type: null,
    value: "",
    id: null,
  });
  const { isAdmin } = useRole();
  const dispatch = useDispatch();

  // fetch the icon types and categories from the API :
  useEffect(() => {
    getIconTypes().then((response) => {
      if (!response.error) {
        setIconTypes(
          response.data.map((type) => ({
            id: type.id,
            name: type.type_name,
            count: type._count.icons,
          }))
        );
      }
    });

    getCategories().then((response) => {
      if (!response.error) {
        setCategories(
          response.data.map((category) => ({
            id: category.id,
            name: category.category_name,
            count: category._count.icons,
          }))
        );
        dispatch(
          setCategoriesAction(
            response.data.map((category) => ({
              id: category.id,
              name: category.category_name,
              count: category._count.icons,
            }))
          )
        ); // Update the Redux store with the fetched categories
      }
    });
  }, []);

  // Sample icons data - replace with your actual data
  const [icons, setIcons] = useState([]);

  // fetching the paginated icons data from the API :
  useEffect(() => {
    getIcons(page + 1, rowsPerPage, "ALL").then((response) => {
      if (!response.error) {
        console.log("sss", response.data);
        setIcons(
          response.data.icons.map((each) => ({
            id: each.id,
            name: each.icon_name,
            category: each.icon_category
              .map((cat) => cat.category_name)
              .join(","),
            type: each.type.type_name,
            dateUploaded: each.createdAt,
            tags: each.icon_tags.map((tag) => tag.tag_name),
            published: each.status == "PUBLISHED",
            iconUrl: createSvgUrlFromCode(each.icon_content),
            downloads: each.downloads,
            icon_svg: each.icon_content,
            categories: each.icon_category,
          }))
        );

        setTotalIcons(response.data.totalCount);
      }
    });
  }, [page, rowsPerPage]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddItem = () => {
    // validations for adding new item :
    if (newItemDialog.type === "category" && !newCategory.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a category name",
        severity: "error",
      });
      return;
    }
    if (!newIconType.trim() && newItemDialog.type === "iconType") {
      setSnackbar({
        open: true,
        message: "Please enter an icon type",
        severity: "error",
      });
      return;
    }

    // update the categories or icon types by adding it and updating the state :
    if (newItemDialog.type === "category") {
      addCategory(newCategory).then((response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: "Failed to add category",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Category added successfully",
            severity: "success",
          });
          setCategories([
            ...categories,
            { id: response.data.id, name: newCategory, count: 0 },
          ]);
          dispatch(
            setCategoriesAction([
              ...categories,
              { id: response.data.id, name: newCategory, count: 0 },
            ])
          );
        }
      });
    } else {
      addIconType(newIconType).then((response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: "Failed to add icon type",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Icon type added successfully",
            severity: "success",
          });
          setIconTypes([
            ...iconTypes,
            { id: response.data.id, name: newIconType },
          ]);
        }
      });
    }

    console.log("Added new item:", newItemName);

    // setNewCategory("");
    // setNewIconType("");

    setNewItemDialog({ open: false, type: null });
  };

  const handleDeleteItem = (id, type) => {
    if (type === "category") {
      setCategories(categories.filter((cat) => cat.id !== id));
      dispatch(setCategoriesAction(categories.filter((cat) => cat.id !== id)));
    } else {
      setIconTypes(iconTypes.filter((iconType) => iconType.id !== id));
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEditIcon = (icon) => {
    setEditedCategory(
      icon.categories.map((cat) => ({ ...cat, name: cat.category_name }))
    );
    setEditedTags(icon.tags.join(", "));
    setEditDialog({ open: true, icon });
  };

  const handleSaveEdit = () => {
    // Implementation for saving edits :
    const { icon } = editDialog;

    // Validations for saving edits :
    if (editedCategory.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one category",
        severity: "error",
      });
      setEditDialog((prev) => ({
        ...prev,
        error: { ...prev.error, category: true },
      }));
      return;
    }

    setEditDialog((prev) => ({
      ...prev,
      error: { ...prev.error, category: false },
    }));

    if (editedTags.trim() === "") {
      setSnackbar({
        open: true,
        message: "Please enter at least one tag",
        severity: "error",
      });
      setEditDialog((prev) => ({
        ...prev,
        error: { ...prev.error, tags: true },
      }));
      return;
    }

    setEditDialog((prev) => ({
      ...prev,
      error: { ...prev.error, tags: false },
    }));

    // Update the icon in the database :
    updateIcon(icon.id, {
      icon_name: icon.name,
      category: editedCategory.map((cat) => cat.id),
      type: iconTypes.find((type) => type.name === icon.type).id,
      tags: editedTags,
      replace_file: false,
      file: "",
    }).then((response) => {
      if (response.error) {
        setSnackbar({
          open: true,
          message: "Failed to update icon",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Icon updated successfully",
          severity: "success",
        });

        // Update the icon in the state :
        setIcons(
          icons.map((i) =>
            i.id === icon.id
              ? {
                  ...i,
                  name: icon.name,
                  category: editedCategory.map((cat) => cat.name).join(","),
                  type: icon.type,
                  tags: editedTags.split(",").map((tag) => tag.trim()),
                  categories: editedCategory.map((cat) => ({
                    ...cat,
                    name: cat.category_name,
                    category_name: cat.name,
                  })), // Update categories with the new values
                }
              : i
          )
        );
      }
    });

    setEditDialog({ open: false, icon: null });
  };

  const handleTogglePublish = (icon) => {
    // Update the icon in the database :
    publishIcons([icon.id], icon.published ? "UNPUBLISHED" : "PUBLISHED").then(
      (response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: `Failed to ${
              icon.published ? "unpublish" : "publish"
            } icon`,
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: `Icon ${
              icon.published ? "unpublished" : "published"
            } successfully`,
            severity: "success",
          });

          // Update the icon in the state :
          setIcons(
            icons.map((i) =>
              i.id === icon.id ? { ...i, published: !i.published } : i
            )
          );
        }
      }
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    // setPage(0); // Reset to first page when filters change
  };

  const handleDeleteClick = (item, type) => {
    setDeleteDialog({ open: true, item, type });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(sortedIcons.map((icon) => icon.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkAction = (action) => {
    if (selected.length === 0) return;

    if (action === "delete") {
      setDeleteDialog({ open: true, type: "bulk" });
    } else {
      // Handle publish/unpublish

      // Update the icons in the database :
      publishIcons(
        selected,
        action == "publish" ? "PUBLISHED" : "UNPUBLISHED"
      ).then((response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: `Failed to ${action} icons`,
            severity: "error",
          });
        } else {
          // Update the icons in the state :
          setIcons(
            icons.map((icon) =>
              selected.includes(icon.id)
                ? { ...icon, published: action === "publish" }
                : icon
            )
          );

          const message = `Icons ${
            action === "publish" ? "published" : "unpublished"
          } successfully`;
          setSnackbar({ open: true, message, severity: "success" });
        }
      });

      setSelected([]);
    }
  };

  /**
   * Confirms the deletion of an item based on the type specified in the delete dialog.
   * Handles various types of deletions including bulk, icon, icon type, and category.
   * Displays a success message upon successful deletion and resets the delete dialog state.
   */

  const handleDeleteConfirm = () => {
    const { type } = deleteDialog;

    if (type === "bulk") {
      // Handle bulk deletion

      // Delete the selected icons from the database :
      deleteIcons(selected).then((response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: "Failed to delete icons",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Selected icons deleted successfully",
            severity: "success",
          });

          // Delete the selected icons from the state :
          setIcons(icons.filter((icon) => !selected.includes(icon.id)));
        }
      });

      setSelected([]);
    } else if (type === "icon") {
      // Handle icon deletion

      // Delete the icon from the database :
      deleteIcons([deleteDialog.item.id]).then((response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: "Failed to delete icon",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Icon deleted successfully",
            severity: "success",
          });

          // Delete the icon from the state :
          setIcons(icons.filter((icon) => icon.id !== deleteDialog.item.id));
        }
      });
    } else if (type === "iconType") {
      // Handle icon type deletion
      deleteIconTypes([deleteDialog.item.id]).then((response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: "Failed to delete icon type",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Icon Type deleted successfully",
            severity: "success",
          });

          // update the icon types state :
          handleDeleteItem(deleteDialog.item.id, type);
        }
      });
    } else {
      // Handle category deletion
      deleteCategories([deleteDialog.item.id]).then((response) => {
        if (response.error) {
          setSnackbar({
            open: true,
            message: "Failed to delete category",
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Category deleted successfully",
            severity: "success",
          });

          // update the categories state :
          handleDeleteItem(deleteDialog.item.id, type);
        }
      });
    }

    setDeleteDialog({ open: false, item: null, type: null });
  };

  const handlePreviewIcon = (icon) => {
    setPreviewModal({ open: true, icon });
  };

  const filteredIcons = icons.filter((icon) => {
    const matchesSearch = icon.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filters.category === "all" ||
      icon.category.split(",").includes(filters.category);
    const matchesType = filters.type === "all" || icon.type === filters.type;
    const matchesPublished =
      filters.published === "all" ||
      (filters.published === "published" ? icon.published : !icon.published);

    return matchesSearch && matchesCategory && matchesType && matchesPublished;
  });

  // Sort function
  const sortedIcons = filteredIcons.sort((a, b) => {
    const isAsc = order === "asc";
    console.log(order);

    if (orderBy === "dateUploaded") {
      return isAsc
        ? new Date(a[orderBy]) - new Date(b[orderBy])
        : new Date(b[orderBy]) - new Date(a[orderBy]);
    } else if (orderBy === "downloads") {
      return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    } else if (orderBy === "tags") {
      const aTags = a[orderBy].join(",").toLowerCase();
      const bTags = b[orderBy].join(",").toLowerCase();
      console.log(aTags, bTags);

      return isAsc ? aTags.localeCompare(bTags) : bTags.localeCompare(aTags);
    }
    return isAsc
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  const handleSaveTypeCategoryEdit = async () => {
    if (editCategoryType.value.trim() === "") {
      setSnackbar({
        open: true,
        message: "Please enter a valid name",
        severity: "error",
      });
      return;
    }

    let response = null;
    if (editCategoryType.type === "category") {
      response = await updateCategory(
        editCategoryType.id,
        editCategoryType.value
      );
    } else {
      response = await updateIconType(
        editCategoryType.id,
        editCategoryType.value
      );
    }

    if (response.error) {
      setSnackbar({
        open: true,
        message: `Failed to update the ${editCategoryType.type}`,
        severity: "error",
      });

      setEditCategoryType({ open: false, type: null, value: "", id: null });
    } else {
      setSnackbar({
        open: true,
        message: `${editCategoryType.type} updated successfully`,
        severity: "success",
      });

      // update the state :
      if (editCategoryType.type === "category") {
        setCategories(
          categories.map((cat) =>
            cat.id === editCategoryType.id
              ? { ...cat, name: editCategoryType.value }
              : cat
          )
        );

        dispatch(
          setCategoriesAction(
            categories.map((cat) =>
              cat.id === editCategoryType.id
                ? { ...cat, name: editCategoryType.value }
                : cat
            )
          )
        );
      } else {
        setIconTypes(
          iconTypes.map((iconType) =>
            iconType.id === editCategoryType.id
              ? { ...iconType, name: editCategoryType.value }
              : iconType
          )
        );
      }
      setEditCategoryType({ open: false, type: null, value: "", id: null });
    }
  };

  if (!isAdmin) return <FullScreenUnauthorized />;

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        mt: "64px",
        ml: "240px",
        width: "calc(100% - 240px)",
      }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/home/manage/")}
        >
          Back to Home
        </Button>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => router.push("/home/manage/upload")}
        >
          Upload Icons
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push("/home/manage/")}
        >
          View Dashboard
        </Button>
      </Stack>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="All Icons" />
          <Tab label="Categories" />
          <Tab label="Icon Types" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />

            <TextField
              select
              size="small"
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Type"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Types</MenuItem>
              {iconTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={filters.published}
              onChange={(e) => handleFilterChange("published", e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="unpublished">Unpublished</MenuItem>
            </TextField>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={selected.length === 0}
                onClick={() => handleBulkAction("publish")}
                startIcon={<PublishIcon />}
              >
                Publish Selected
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={selected.length === 0}
                onClick={() => handleBulkAction("unpublish")}
                startIcon={<UnpublishedIcon />}
              >
                Unpublish Selected
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={selected.length === 0}
                onClick={() => handleBulkAction("delete")}
                startIcon={<DeleteIcon />}
              >
                Delete Selected
              </Button>
              {selected.length > 0 && (
                <Typography sx={{ alignSelf: "center" }}>
                  {selected.length} items selected
                </Typography>
              )}
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selected.length > 0 &&
                        selected.length === sortedIcons.length
                      }
                      indeterminate={
                        selected.length > 0 &&
                        selected.length < sortedIcons.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {[
                    { id: "icon", label: "Icon" },
                    { id: "name", label: "Name" },
                    { id: "category", label: "Category" },
                    { id: "type", label: "Type" },
                    { id: "tags", label: "Tags" },
                    { id: "downloads", label: "Downloads" },
                    { id: "dateUploaded", label: "Date Uploaded" },
                    { id: "actions", label: "Actions" },
                  ].map((column) => (
                    <TableCell
                      key={column.id}
                      sortDirection={orderBy === column.id ? order : false}
                      onClick={() =>
                        column.id !== "actions" &&
                        column.id !== "icon" &&
                        handleSort(column.id)
                      }
                      sx={
                        column.id !== "actions" && column.id !== "icon"
                          ? { cursor: "pointer" }
                          : {}
                      }
                    >
                      {column.label}
                      {orderBy === column.id && (
                        <Box component="span" sx={{ ml: 1 }}>
                          {order === "desc" ? "↓" : "↑"}
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedIcons.map((icon) => (
                  <TableRow key={icon.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(icon.id)}
                        onChange={(e) => handleSelectOne(e, icon.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePreviewIcon(icon)}
                      >
                        <Image
                          src={icon.iconUrl}
                          alt={icon.name}
                          width={40}
                          height={40}
                          style={{ objectFit: "contain" }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{icon.name}</TableCell>
                    <TableCell>
                      {" "}
                      {icon.category.split(",").map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>{icon.type}</TableCell>
                    <TableCell>
                      {icon.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>{icon.downloads}</TableCell>
                    <TableCell>
                      {new Date(icon.dateUploaded).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditIcon(icon)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleTogglePublish(icon)}
                        color={icon.published ? "primary" : "default"}
                      >
                        {icon.published == true ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(icon, "icon")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalIcons}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewItemDialog({ open: true, type: "category" })}
            sx={{ mb: 2 }}
          >
            Add Category
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Icons Count</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "20px" }}>
                        <IconButton
                          edge="end"
                          onClick={() =>
                            handleDeleteClick(category, "category")
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setEditCategoryType({
                              open: true,
                              type: "category",
                              value: category.name,
                              id: category.id,
                            });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewItemDialog({ open: true, type: "iconType" })}
            sx={{ mb: 2 }}
          >
            Add Icon Type
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Icons Count</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {iconTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{type.count}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "20px" }}>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteClick(type, "iconType")}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setEditCategoryType({
                              open: true,
                              type: "iconType",
                              value: type.name,
                              id: type.id,
                            });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      <Dialog
        open={newItemDialog.open}
        onClose={() => {
          setNewItemDialog({ open: false, type: null });
          setNewCategory("");
          setNewIconType("");
        }}
      >
        <DialogTitle>
          Add New {newItemDialog.type === "category" ? "Category" : "Icon Type"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={
              newItemDialog.type === "category" ? newCategory : newIconType
            }
            onChange={(e) => {
              if (newItemDialog.type === "category") {
                setNewCategory(e.target.value);
              } else {
                setNewIconType(e.target.value);
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewItemDialog({ open: false, type: null })}>
            Cancel
          </Button>
          <Button onClick={handleAddItem} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, icon: null })}
      >
        <DialogTitle>Edit Icon</DialogTitle>
        <DialogContent>
          {/* <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField> */}
          <Autocomplete
            sx={{}}
            multiple
            id="tags-outlined"
            options={categories}
            getOptionLabel={(option) => option.name}
            defaultValue={editDialog.icon?.categories?.map((cat) => ({
              ...cat,
              name: cat.category_name,
            }))}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="" placeholder="Categories" />
            )}
            onChange={(event, value) => {
              console.log(value);

              setEditedCategory(value);
            }}
          />
          {editDialog.error?.category && (
            <Typography color="red" variant="caption">
              Please select at least one category
            </Typography>
          )}

          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            sx={{ mt: 2 }}
          />

          {editDialog.error?.tags && (
            <Typography color="red" variant="caption">
              Please select at least one tag
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, icon: null })}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null, type: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteDialog.type === "bulk"
              ? `Are you sure you want to delete ${selected.length} selected icons? This action cannot be undone.`
              : `Are you sure you want to delete this ${deleteDialog.type}? This action cannot be undone.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({ open: false, item: null, type: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editCategoryType.open}
        onClose={() => {
          setEditCategoryType({ open: false, type: null, value: "", id: null });
        }}
      >
        <DialogTitle>Edit {editCategoryType.type}</DialogTitle>
        <DialogContent>
          <TextField
            value={editCategoryType.value}
            onInput={(e) => {
              setEditCategoryType({
                ...editCategoryType,
                value: e.target.value,
              });
              console.log(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditCategoryType({ open: false, type: null, value: "" });
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveTypeCategoryEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <IconPreviewModal
        open={previewModal.open}
        icon={previewModal.icon}
        onClose={() => setPreviewModal({ open: false, icon: null })}
      />

      <Snackbar
        open={snackbar.open}
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
