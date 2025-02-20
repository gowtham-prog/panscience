"use client"

import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { TextField, Button, Paper, Typography, Link } from "@mui/material"
import axios from "axios"

export default function Register() {
    const serverUrl = import.meta.env.VITE_SERVER_URL
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match")
            return
        }

        try {
            await axios.post(`${serverUrl}/api/v1/user/create/`, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            })
            navigate("/login")
        } catch (error) {
            console.error("Registration failed:", error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Paper className="max-w-md w-full space-y-8 p-10">
                <div>
                    <Typography component="h1" variant="h4" className="text-center font-bold">
                        Create your account
                    </Typography>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <TextField
                            required
                            fullWidth
                            label="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>
                    <Button type="submit" fullWidth variant="contained" className="bg-black">
                        Sign up
                    </Button>
                    <div className="text-center mt-4">
                        <Link component={RouterLink} to="/login" className="text-black">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </Paper>
        </div>
    )
}

