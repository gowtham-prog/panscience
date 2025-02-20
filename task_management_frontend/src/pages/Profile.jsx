"use client"

import { Avatar, Button, Paper, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export default function Profile() {
    const serverUrl = import.meta.env.VITE_SERVER_URL
    console.log("api", serverUrl)

    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        profile_image: null,
    })
    const [newProfileImage, setNewProfileImage] = useState(null)

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
        if (newProfileImage) {
            formData.append("profile_image", newProfileImage)
        }

        try {
            await axios.patch(`${serverUrl}/api/v1/user/update/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            fetchProfile()
            window.location.reload()
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
                    <Avatar src={newProfileImage ? URL.createObjectURL(newProfileImage) : (serverUrl+profile.profile_image)} alt={profile.username} sx={{ width: 100, height: 100 }} className="mb-4" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewProfileImage(e.target.files[0])}
                        className="hidden"
                        id="avatar-input"
                    />
                    <label htmlFor="avatar-input">
                        <Button variant="outlined" component="span">
                            Change Avatar
                        </Button>
                    </label>
                </div>
                <div className="flex flex-col items-center justify-between space-y-4">
                    <div className="space-y-4 w-full pb-4">
                        <TextField
                            fullWidth
                            label="Username"
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        />
                    </div>
                    <div className="space-y-4 w-full pb-4">
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>
                </div>
                <Button type="submit" variant="contained" fullWidth className="bg-black">
                    Save Changes
                </Button>
            </form>
        </Paper>
    )
}

