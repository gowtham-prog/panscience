import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${serverUrl}/api/token/`, credentials);
            localStorage.setItem("token", response.data.access);
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
            return response.data.user; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return true;
    } else {
        return rejectWithValue(false);
    }
});



export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    return null;
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        authenticated: false,
        loading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.authenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.authenticated = false;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(checkAuth.fulfilled, (state) => {
                state.authenticated = true;
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.authenticated = false;
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.authenticated = false;
            });
    },
});

export default authSlice.reducer;
