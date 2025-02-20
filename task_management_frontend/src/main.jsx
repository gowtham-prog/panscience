import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider, createTheme } from "@mui/material"


const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
  },
})

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    
      <BrowserRouter>
      <AuthProvider>
        <App />
        </AuthProvider>
      </BrowserRouter>
    {/* </AuthProvider> */}
    </ThemeProvider>
  </React.StrictMode>
)
