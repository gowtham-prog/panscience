"use client";

import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { TextField, Button, Paper, Typography, Link, Avatar,Snackbar,Alert } from "@mui/material";
import axios from "axios";
import Loader from "../components/loader";
export default function Register() {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [loading,setLoading] = useState(false);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (profileImage) {
            data.append("profile_image", profileImage);
        }
        setLoading(true)
        try {
            await axios.post(`${serverUrl}/api/v1/user/create/`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/login");
        } catch (error) {
            setError(error.message);
            console.error("Registration failed:", error);
        }finally{
            setLoading(false)
        }
    };

    if(loading){
        return <Loader/>
    }

    return (
        <div className="min-h-screen min-w-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8 w-full max-w-7xl">
                <div className="max-h-screen h-full w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <Paper className="max-w-md w-full space-y-8 p-10">
                        <div>
                            <Typography component="h1" variant="h4" className="text-center font-bold">
                                Create your account
                            </Typography>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center justify-between space-y-4">
                                {preview && <Avatar src={preview} sx={{ width: 100, height: 100 }} />}
                                
                                <div className="space-y-4 w-full pb-4">
                                    <TextField
                                        required
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-4 w-full pb-4">
                                    <TextField
                                        required
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-4 w-full pb-4">
                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-4 w-full pb-4">
                                    <TextField
                                        required
                                        fullWidth
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-4 w-full pb-4">
                                    <Button variant="contained" component="label" className="bg-gray-300 text-black">
                                        Upload Profile Picture
                                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                    </Button>
                                </div>
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
                <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            </main>
        </div>
    );
}
