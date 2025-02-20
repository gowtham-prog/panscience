
import { Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/layout'
import TaskList from './pages/TaskList'
import TaskForm from './pages/TaskForm'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route index element={<TaskList />} />
        <Route path="task/new" element={<TaskForm />} />
        <Route path="task/:id" element={<TaskForm />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
