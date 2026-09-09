import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<div>Login page coming soon</div>} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div>Dashboard coming soon</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App