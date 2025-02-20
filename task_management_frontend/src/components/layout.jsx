"use client";

import { Add as AddIcon } from "@mui/icons-material";
import { AppBar, Avatar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/AuthSlice";
import axios from "axios";


export default function Layout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    const state = useSelector((state) => state.auth);
    const [user, setUser] = useState(null);

    console.log("user here", state)

    const fetchUser = async () => {
        try {
            const url = `${serverUrl}/api/v1/user/get`; // Dynamic API endpoint
            const response = await axios.get(url);
            console.log("this",response.data)
            setUser(response.data); // Sort immediately after fetching
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchUser()
    },[])

    console.log("user here", user)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose();
        navigate("/profile");
    };

    const handleLogout = () => {
        handleClose();
        dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <div className="min-h-screen min-w-screen bg-gray-50">
            <AppBar position="static" className="bg-black w-full">
                <Toolbar>
                    <Typography variant="h6" component="div" className="flex-grow">
                        Task Manager
                    </Typography>
                    {state && (
                        <>
                            <IconButton color="inherit" onClick={() => {
                                navigate("/task/new")
                                window.location.reload()
                            }} className="mr-2">
                                <AddIcon />
                            </IconButton>
                            <IconButton onClick={handleMenu} color="inherit">
                                <Avatar src={serverUrl+user?.profile_image} alt={user?.username} />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <main className="container mx-auto px-4 py-8 w-full max-w-7xl">
                <Outlet />
            </main>
        </div>
    );
}
