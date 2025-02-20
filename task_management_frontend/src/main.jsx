import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider, createTheme } from "@mui/material"
import { Provider } from 'react-redux'
import store from './store/store.js'


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
      <Provider store={store}>

        <App />
      </Provider>
    {/* </AuthProvider> */}
    </ThemeProvider>
  </React.StrictMode>
)
