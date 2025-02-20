"use client"

import { useState, useEffect } from "react"
import { Paper, Typography, TextField, Button, Avatar } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router"
import axios from "axios"

export default function Profile() {
    const serverUrl = import.meta.env.VITE_SERVER_URL
    console.log("api", serverUrl)

    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        avatar: null,
    })
    const [newAvatar, setNewAvatar] = useState(null)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/v1/user/get`)
            setProfile(response.data)
        } catch (error) {
            console.error("Error fetching profile:", error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("username", profile.username)
        formData.append("email", profile.email)
        if (newAvatar) {
            formData.append("avatar", newAvatar)
        }

        try {
            await axios.put(`${serverUrl}/api/v1/user/update/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            fetchProfile()
        } catch (error) {
            console.error("Error updating profile:", error)
        }
    }

    return (
        <Paper className="p-6 max-w-lg mx-auto">
            <Typography variant="h5" className="mb-6">
                Profile Settings
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                    <Avatar src={profile.avatar} alt={profile.username} sx={{ width: 100, height: 100 }} className="mb-4" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewAvatar(e.target.files[0])}
                        className="hidden"
                        id="avatar-input"
                    />
                    <label htmlFor="avatar-input">
                        <Button variant="outlined" component="span">
                            Change Avatar
                        </Button>
                    </label>
                </div>
                <TextField
                    fullWidth
                    label="Username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <Button type="submit" variant="contained" fullWidth className="bg-black">
                    Save Changes
                </Button>
            </form>
        </Paper>
    )
}

