import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from './context';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../utils/Constants';

const ContextProvider = (props) => {
    // adminId, setAdminId, password, setPassword, showPassword, setShowPassword, error, setError
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!adminId || !password) {
            setError('Please fill in both fields.');
            return;
        }
        // passowrd: Debtors@2025

        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/admin-login`, {
                adminId,
                password
            });

            localStorage.setItem('token', response.data.adminToken);
            navigate('/');
            setError('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                console.error('Error:', error);
            }
        }

        console.log({ adminId, password });
        setError('');
    };

    const HandleAdminLogout = () => {
        localStorage.removeItem('token');
        toast.success("Admin Logout Successful")
        navigate('/auth/login');
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users`);
            if (response.data.success) {
                console.log("Users getting: ", response.data.result);
                setUsers(response.data.result);
            }
        } catch (error) {
            console.log("Error fetching users:", error);

        }
    }
    useEffect(() => {
        fetchUsers();
    }, []);


    const contextValue = {
        adminId,
        setAdminId,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        error,
        setError,
        users,
        setUsers,
        HandleAdminLogout,
        handleSubmit
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}

export default ContextProvider;