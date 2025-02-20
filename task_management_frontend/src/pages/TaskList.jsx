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
    Snackbar,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Tabs,
    Tab,
    Chip,
    Collapse
} from "@mui/material";
import {
    LinearProgress
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from "@mui/icons-material";
import Loader from "../components/loader";
import axios from "axios";

export default function TaskList() {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState("status");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("assigned");
    const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows
    const [error,setError] = useState("")
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [activeTab]);

    useEffect(() => {
        if (tasks.length > 0) {
            setTasks(sortTasks([...tasks], sortBy));
        }
    }, [sortBy]);

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const url = `${serverUrl}/api/v1/task/${activeTab}`;
            const response = await axios.get(url);
            setTasks(sortTasks(response.data, sortBy));
        } catch (error) {
            setError(error.message)
            console.error("Error fetching tasks:", error);
        }finally{
            setLoading(false)
        }
    };

    const handleDelete = async (id) => {
        setLoading(true)
        try {
            await axios.delete(`${serverUrl}/api/v1/task_detail/${id}/`);
            fetchTasks();
        } catch (error) {
            setError(error.message)
            console.error("Error deleting task:", error);
        }finally{
            setLoading(false)
        }
    };

    const toggleExpandRow = (taskId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [taskId]: !prev[taskId] // Toggle expand/collapse
        }));
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

    if(loading){
        return <Loader/>
    }

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)} indicatorColor="primary" textColor="primary">
                <Tab label="Assigned" value="assigned" />
                <Tab label="Created" value="created" />
            </Tabs>

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
                            <TableCell></TableCell>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Priority</strong></TableCell>
                            <TableCell><strong>Due Date</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <>
                                    {/* Main Row */}
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => toggleExpandRow(task.id)}>
                                                {expandedRows[task.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{task.task_name}</TableCell>
                                        <TableCell>
                                            <Chip label={task.status.replace("_", " ")} color={task.status === "completed" ? "success" : "default"} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={task.priority} color={task.priority === "high" ? "error" : "default"} />
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

                                    {/* Expanded Details Row */}
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                            <Collapse in={expandedRows[task.id]} timeout="auto" unmountOnExit>
                                                <Box margin={2}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Task Details:
                                                    </Typography>
                                                    <Typography variant="body2">{task.task_description}</Typography>
                                                    <Typography variant="body2"><strong>Created By:</strong> {task.created_by.username}</Typography>
                                                    {
                                                        task.assigned_to && (
                                                            <Typography variant="body2"><strong>Assigned To:</strong> {task.assigned_to.username}</Typography>
                                                        )
                                                    }
                                                    <Typography variant="body2"><strong>Priority:</strong> {task.priority}</Typography>
                                                    <Typography variant="body2"><strong>Due Date:</strong> {formatDate(task.due_date)}</Typography>
                                                    <Typography variant="body2"><strong>Created At:</strong> {formatDate(task.created_at)}</Typography>
                                                    <Typography variant="body2"><strong>Updated At:</strong> {formatDate(task.updated_at)}</Typography>
                                                    {
                                                        task.task_files && task.task_files.length > 0 && (
                                                            <Typography variant="body2"><strong>Task Files:</strong> {task.task_files.map((file) =>{
                                                                return (
                                                                    <div>
                                                                    <a href={serverUrl+file?.file} target="_blank" rel="noopener noreferrer">
                                                                        {file.id + "-" + file.file+ "-" + file.uploaded_on}
                                                                    </a>
                                                                    </div>
                                                                );
                                                            })}</Typography>
                                                        )
                                                    }
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No tasks found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </div>
    );
}
