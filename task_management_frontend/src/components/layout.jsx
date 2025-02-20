"use client"

import { Outlet, useNavigate } from "react-router-dom"
import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem } from "@mui/material"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Add as AddIcon } from "@mui/icons-material"

export default function Layout() {
    const { user, logout, authenticated } = useAuth()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleProfile = () => {
        handleClose()
        navigate("/profile")
    }

    return (
        <div className="min-h-screen min-w-screen bg-gray-50">
            
                <AppBar position="static" className="bg-black w-full">
                <Toolbar>
                    <Typography variant="h6" component="div" className="flex-grow">
                        Task Manager
                    </Typography>
                    <IconButton color="inherit" onClick={() => navigate("/task/new")} className="mr-2">
                        <AddIcon />
                    </IconButton>
                    <IconButton onClick={handleMenu} color="inherit">
                        <Avatar src={user?.avatar} alt={user?.username} />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            
            <main className="container mx-auto px-4 py-8 w-full max-w-7xl">
                <Outlet />
            </main>
        </div>
    )
}

