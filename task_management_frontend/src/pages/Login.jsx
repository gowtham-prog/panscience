"use client"

import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { TextField, Button, Paper, Typography, Link } from "@mui/material"
import { useAuth } from "../context/AuthContext"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


export default function Login() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    })
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(credentials)
        } catch (error) {
            setErrorMessage(error?.message)
            setError(true)
            console.error("Login failed:", error)
        }
    }
    const [error,setError] = useState("")
    const [errorMessage,setErrorMessage] = useState("")

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Snackbar open={error} autoHideDuration={6000} onClose={()=>{
                setError(false)
                setErrorMessage("")
            }}>
                <Alert
                    onClose={()=>{
                        setError(false)
                        setErrorMessage("")
                    }}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {{errorMessage}}
                </Alert>
            </Snackbar>
            <Paper className=" h-full space-y-8 p-10">
                <div>
                    <Typography component="h1" variant="h4" className="text-center font-bold">
                        Sign in to Task Manager
                    </Typography>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <TextField
                            required
                            fullWidth
                            label="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
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
    )
}

