"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const serverUrl = import.meta.env.VITE_SERVER_URL
    // console.log("api", serverUrl)
    const navigate = useNavigate()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = () => {
        const token = localStorage.getItem("token")
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        try {
            setLoading(true)
            const response = await axios.post(`${serverUrl}/api/token/`, credentials)
            localStorage.setItem("token", response.data.access)
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`
            setUser(response.data.user)
            setAuthenticated(true)
            setLoading(false)
            navigate("/")
        } catch (error) {
            setLoading(false)
            setAuthenticated(false)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        delete axios.defaults.headers.common["Authorization"]
        navigate("/login")
    }

    return <AuthContext.Provider value={{ user, login, logout, loading, authenticated }}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

