"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import useDashboardStats from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("week");
  const { stats, downloadTrends, topDownloaded, categoryStats, isLoading } =
    useDashboardStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/home")}
        >
          Back to Icons
        </Button>
        <TextField
          select
          size="small"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="week">Last 7 days</MenuItem>
          <MenuItem value="month">Last 30 days</MenuItem>
          <MenuItem value="year">Last 12 months</MenuItem>
        </TextField>
      </Stack>

      <Grid container spacing={3}>
        {/* Quick Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Icons
              </Typography>
              <Typography variant="h4">{stats.totalIcons}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Downloads
              </Typography>
              <Typography variant="h4">{stats.totalDownloads}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4">{stats.activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Published Icons
              </Typography>
              <Typography variant="h4">{stats.publishedIcons}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Download Trends Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Download Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={downloadTrends}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" dy={10} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="downloads" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Downloaded Icons */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            maxHeight: "400px",
            "&::-webkit-scrollbar": {
              display: "none", // hides the scrollbar
            },
            overflowY: "auto",}}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Downloaded Icons
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Downloads</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topDownloaded.map((icon) => (
                    <TableRow key={icon.id}>
                      <TableCell>{icon.name}</TableCell>
                      <TableCell align="right">{icon.downloads}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="icons"
                  fill="#8884d8"
                  name="Icons"
                />
                <Bar
                  yAxisId="left"
                  dataKey="category"
                  fill="#8884d8"
                  name="Category"
                />
                <Bar
                  yAxisId="right"
                  dataKey="downloads"
                  fill="#82ca9d"
                  name="Downloads"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
