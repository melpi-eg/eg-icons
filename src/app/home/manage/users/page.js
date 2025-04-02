"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { assignRole, deleteUsers, getUsers } from "@/api/users";
import useRole from "@/hooks/useRole";
import FullScreenUnauthorized from "@/app/components/Unauthorized";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

const fetchUsers = async () => {
  const { data, error } = await getUsers();

  if (error) {
    return [];
  }

  return data;
};

export default function UserManagement() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const { isSuperAdmin } = useRole();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  const handleRoleChange = () => {
    if (editUser) {
      assignRole([editUser.id], newRole).then((response) => {
        if (!response.error) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === editUser.id ? { ...user, role: newRole } : user
            )
          );
          setEditUser(null);
          setSnackbar({
            open: true,
            message: "Role updated successfully",
            severity: "success",
          });
        }
      });
    }
  };

  const handleDeleteUser = () => {
    if (deleteUser) {
      deleteUsers([deleteUser.id]).then((response) => {
        if (!response.error) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== deleteUser.id)
          );
          setDeleteUser(null);
          setSnackbar({
            open: true,
            message: "User deleted successfully",
            severity: "success",
          });
        }
      });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deleteUser.id)
      );
      setDeleteUser(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isSuperAdmin) {
    return <FullScreenUnauthorized />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        mt: "64px",
        ml: "240px",
        width: "calc(100% - 240px)",
        paddingBlock: "auto",
        minHeight: "70vh",
      }}
    >
      <Paper
        sx={{ padding: 2, backgroundColor: theme.palette.background.paper }}
      >
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setEditUser(user);
                          setNewRole(user.role);
                        }}
                        disabled={user.role === "SUPERADMIN"}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setDeleteUser(user);
                        }}
                        disabled={user.role === "SUPERADMIN"}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
        {/* Role Edit Modal */}
        <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)}>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogContent>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleRoleChange} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete User Modal */}
        <Dialog
          open={Boolean(deleteUser)}
          onClose={() => {
            setDeleteUser(null);
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              {`Are you sure you want to delete this user with the username ${deleteUser?.username}?`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
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
      </Paper>
    </Box>
  );
}
