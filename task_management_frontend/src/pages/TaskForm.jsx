"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Autocomplete,
    Snackbar,
    Alert,
    LinearProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function TaskForm() {
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({
        task_name: "",
        task_description: "",
        status: "Pending",
        due_date: "",
        assigned_to: [],
        task_files: [],
        priority: "medium"
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        fetchUsers();
        if (id) fetchTask();
    }, [id]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/user/list`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTask = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/task_detail/${id}/`);
            setTask(response.data);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);

        if (newFiles.length + task.task_files.length > 3) {
            setError("You can upload a maximum of 3 files.");
            return;
        }

        setTask((prev) => ({
            ...prev,
            task_files: [...prev.task_files, ...newFiles]
        }));
    };

    const handleRemoveFile = (index) => {
        setTask((prev) => ({
            ...prev,
            task_files: prev.task_files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!task.task_name.trim()) {
            setError("Task title is required.");
            setLoading(false);
            return;
        }

        if (!task.due_date) {
            setError("Due date is required.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("task_name", task.task_name);
            formData.append("task_description", task.task_description);
            formData.append("status", task.status);
            formData.append("due_date", task.due_date);
            formData.append("priority", task.priority);
            task.assigned_to.forEach(userId => formData.append("assigned_to", userId));
            formData.append("task_files", JSON.stringify(task.task_files));
            task.task_files.forEach(file => formData.append("task_files[]", file));


            const config = {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                },
            };

            console.log("formData", formData)

            if (id) {
                await axios.put(`${serverUrl}/api/v1/task_detail/${id}/`, formData, config);
            } else {
                await axios.post(`${serverUrl}/api/v1/task`, formData, config);
            }

            navigate("/");
        } catch (error) {
            console.error("Error saving task:", error);
            setError("Failed to save task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <IconButton onClick={() => navigate("/")} className="mb-4 hover:bg-none">
                <ArrowBack /> Back to tasks
            </IconButton>
        
        <Paper className="p-6 max-w-lg mx-auto h-full">
            
            <Typography variant="h5" className="mb-4">
                {id ? "Edit Task" : "Create New Task"}
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={task.task_name}
                            onChange={(e) => setTask({ ...task, task_name: e.target.value })}
                            required
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            value={task.task_description}
                            onChange={(e) => setTask({ ...task, task_description: e.target.value })}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Status</InputLabel>
                            <Select value={task.status} label="Status" onChange={(e) => setTask({ ...task, status: e.target.value })}>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="on_hold">On Hold</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Priority</InputLabel>
                            <Select value={task.priority} label="Status" onChange={(e) => setTask({ ...task, priority: e.target.value })}>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="low">Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={task.due_date}
                            onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={users}
                            getOptionLabel={(option) => `${option.username} (${option.email})`}
                            value={users.filter(user => task.assigned_to.includes(user.id))}
                            onChange={(_, newValue) => setTask({ ...task, assigned_to: newValue.map(user => user.id) })}
                            renderInput={(params) => <TextField {...params} label="Assigned To" variant="outlined" fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Upload Files (Max: 3)</Typography>
                        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                            Choose Files
                            <input type="file" multiple accept=".jpg,.png,.pdf,.docx" hidden onChange={handleFileChange} />
                        </Button>
                        <List>
                            {task.task_files.map((file, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={file.name} secondary={file.type} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <Grid item xs={12}>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                        </Grid>
                    )}
                </Grid>

                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? "Saving..." : id ? "Update" : "Create"}
                </Button>
            </form>

            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Paper>
        </>
    );
}
