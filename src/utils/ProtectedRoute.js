import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isLoggedAdmin = localStorage.getItem("token");
    return isLoggedAdmin ? children : window.location.href = "/auth/login";
};

export default ProtectedRoute;