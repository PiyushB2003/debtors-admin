import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const isLogged = localStorage.getItem("token");

    if (isLogged) {
        return (
            window.location.href = "/"
        );
    }
    return children;
};

export default PublicRoute;