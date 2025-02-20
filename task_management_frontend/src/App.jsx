
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Layout from './components/layout'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import TaskForm from './pages/TaskForm'
import TaskList from './pages/TaskList'
import ProtectedRoute from './store/protectedRoute'
import { useDispatch } from 'react-redux'
import React,{useState,useEffect} from 'react'
import { checkAuth } from './store/AuthSlice'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (

          <Router>
              <Routes>
                  {/* Public routes (login & register should not be accessible if authenticated) */}
                  <Route element={<ProtectedRoute requireAuth={false} />}>
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                  </Route>

                  {/* Private routes (require authentication) */}
                  <Route element={<ProtectedRoute requireAuth={true} />}>
                      <Route path="/" element={<Layout />}>
                          <Route index element={<TaskList />} />
                          <Route path="task/new" element={<TaskForm />} />
                          <Route path="task/:id" element={<TaskForm />} />
                          <Route path="profile" element={<Profile />} />
                      </Route>
                  </Route>
              </Routes>
          </Router>

  );
}

export default App
