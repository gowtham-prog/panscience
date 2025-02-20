"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Tabs,
    Tab,
    Chip,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import axios from "axios";

export default function TaskList() {
    const serverUrl = import.meta.env.VITE_SERVER_URL

    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState("status");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("assigned"); // Tabs state
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [activeTab]); // Refetch tasks when the tab changes

    useEffect(() => {
        if (tasks.length > 0) {
            setTasks(sortTasks([...tasks], sortBy));
        }
    }, [sortBy]);

    const fetchTasks = async () => {
        try {
            const url = `${serverUrl}/api/v1/task/${activeTab}`; // Dynamic API endpoint
            const response = await axios.get(url);
            setTasks(sortTasks(response.data, sortBy)); // Sort immediately after fetching
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${serverUrl}/api/v1/task_detail/${id}/`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const sortTasks = (taskList, criteria) => {
        return taskList.sort((a, b) => {
            if (criteria === "status") {
                const statusOrder = { "pending": 1, "in_progress": 2, "on_hold": 3, "cancelled": 4, "completed": 5 };
                return statusOrder[a.status] - statusOrder[b.status];
            } else if (criteria === "due_date") {
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(a.due_date) - new Date(b.due_date);
            }
            return 0;
        });
    };

    const formatDate = (date) => {
        if (!date) return "No due date";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const filteredTasks = statusFilter === "all" ? tasks : tasks.filter((task) => task.status === statusFilter);

    return (
        <div className="space-y-6">
            {/* Tabs for Assigned / Created */}
            <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)} indicatorColor="primary" textColor="primary">
                <Tab label="Assigned" value="assigned" />
                <Tab label="Created" value="created" />
            </Tabs>

            {/* Header with Sorting and Status Filtering */}
            <Box className="flex justify-between items-center">
                <Typography variant="h5" className="font-bold text-black">
                    {activeTab === "assigned" ? "Assigned Tasks" : "Created Tasks"}
                </Typography>
                <Box className="flex space-x-4">
                    {/* Status Filter */}
                    <FormControl variant="outlined" size="small" className="min-w-[200px]">
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="on_hold">On Hold</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Sorting Filter */}
                    <FormControl variant="outlined" size="small" className="min-w-[200px]">
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                            <MenuItem value="status">Status</MenuItem>
                            <MenuItem value="due_date">Due Date</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Task Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Assigned To</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Due Date</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.task_name}</TableCell>
                                    <TableCell>{task.task_description}</TableCell>
                                    <TableCell>
                                        {task.assigned_to.map((user) =>{
                                            return(
                                                <Box display="flex" alignItems="center">
                                                    <PersonIcon fontSize="small" className="mr-1 text-gray-500" />
                                                    {user.username || "Unassigned"}
                                                </Box>
                                            )
                                        })
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.status.replace("_", " ")}
                                            color={task.status === "completed" ? "success" : "default"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <ScheduleIcon fontSize="small" className="mr-1 text-gray-500" />
                                            {formatDate(task.due_date)}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => navigate(`/task/${task.id}`)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(task.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No tasks found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
