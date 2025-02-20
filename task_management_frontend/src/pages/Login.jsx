"use client"

import { Button, Link, Paper, TextField, Typography } from "@mui/material"
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/AuthSlice"
import { useNavigate,Link as RouterLink } from "react-router-dom";

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, loading } = useSelector((state) => state.auth);

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(loginUser(credentials));
            if (loginUser.fulfilled.match(resultAction)) {
                navigate("/task"); // Redirect to home on success
            }
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="min-h-screen min-w-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8 w-full max-w-7xl">
            <div className="max-h-screen h-full w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Snackbar open={error} autoHideDuration={6000} onClose={() => {
                    setError(false)
                    setErrorMessage("")
                }}>
                    <Alert
                        onClose={() => {
                            setError(false)
                            setErrorMessage("")
                        }}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {{ errorMessage }}
                    </Alert>
                </Snackbar>
                <Paper className=" h-full space-y-8 p-10">
                    <div>
                        <Typography component="h1" variant="h4" className="text-center font-bold">
                            Sign in to Task Manager
                        </Typography>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center justify-between space-y-4">
                            <div className="space-y-4 w-full pb-4">
                                <TextField className=""
                                    required
                                    fullWidth
                                    label="Username"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4 w-full pb-4">
                                <TextField className=""
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button type="submit" fullWidth variant="contained" className="bg-black">
                            Sign in
                        </Button>
                        <div className="text-center mt-4">
                            <Link component={RouterLink} to="/register" className="text-black">
                                Don't have an account? Sign up
                            </Link>
                        </div>
                    </form>
                </Paper>
            </div>
            </main>
        </div>
    )
}

export default Login