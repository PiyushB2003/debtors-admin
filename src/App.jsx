import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Panel from './pages/Panel'
import Login from './pages/Login'
import ContextProvider from './context/ContextProvider'
import ProtectedRoute from './utils/ProtectedRoute'
import PublicRoute from './utils/PublicRoute'
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ContextProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Panel />
            </ProtectedRoute>
          }
          />
          <Route path="/auth/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ContextProvider>
    </>
  )
}

export default App