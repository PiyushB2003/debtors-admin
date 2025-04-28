import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context/context';
import SearchIcon from '@mui/icons-material/Search';
import { Switch } from '@headlessui/react'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { BACKEND_URL } from '../utils/Constants';
const Panel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userStatuses, setUserStatuses] = useState({});
    const [enabled, setEnabled] = useState(true)
    const { users, HandleAdminLogout } = useContext(Context);


    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            HandleAdminLogout();
        } else {
            console.log("Logout cancelled");
        }
    };

    const sortedUsers = users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Filter users based on search term
    const filteredUsers = sortedUsers?.filter(user =>
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (Object.keys(userStatuses).length === 0) {
            const initialStatuses = filteredUsers.reduce((acc, user) => {
                acc[user.id] = user.is_active === 1;
                return acc;
            }, {});
            setUserStatuses(initialStatuses);
        }
    }, [filteredUsers, userStatuses]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
            {/* Logout Button outside the card */}
            <div className="max-w-4xl mx-auto flex justify-end mb-6">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow transition duration-200 cursor-pointer"
                >
                    Logout
                </button>
            </div>

            {/* Card with table */}
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <div className='flex flex-row items-center justify-between w-full'>
                    <div className='mb-4'>
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-0">Admin Panel</h1>
                        <p><span className='font-medium'>Total users</span> ({users.length})</p>
                    </div>

                    {/* Search Bar with Icon */}
                    <div className="mb-6 w-1/2 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-blue-600">
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">SN</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">User Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Joining Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Entries</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers?.map((user, index) => {
                                const isActive = userStatuses[user.id];
                                const userDate = new Date(user.created_at);
                                const today = new Date();
                                const yesterday = new Date();
                                yesterday.setDate(today.getDate() - 1);

                                // Format all dates to YYYY-MM-DD for easy comparison
                                const formatDate = (date) => date.toISOString().split('T')[0];
                                const userFormatted = formatDate(userDate);
                                const todayFormatted = formatDate(today);
                                const yesterdayFormatted = formatDate(yesterday);

                                let displayDate;
                                if (userFormatted === todayFormatted) {
                                    displayDate = "Today";
                                } else if (userFormatted === yesterdayFormatted) {
                                    displayDate = "Yesterday";
                                } else {
                                    displayDate = userDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                                }

                                const handleToggle = async (userId, newStatus) => {
                                    try {
                                        const response = await axios.put(`${BACKEND_URL}/api/users/${userId}/status`, {
                                            is_active: newStatus ? 1 : 0,
                                        });

                                        if (response.status === 200) {
                                            setUserStatuses((prev) => ({
                                                ...prev,
                                                [userId]: newStatus,
                                            }));
                                        } else {
                                            console.error("Failed to update status");
                                        }
                                    } catch (error) {
                                        console.error("Error updating status:", error);
                                    }
                                };
                                return (
                                    <tr
                                        key={user.id}
                                        className={index % 2 === 0 ? "bg-blue-50 hover:bg-blue-100 transition" : "bg-white hover:bg-blue-50 transition"}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{user.firstname} {user.lastname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{displayDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.entries}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <Switch.Group>
                                                <div className="flex items-center">
                                                    <Switch
                                                        checked={isActive}
                                                        onChange={() => handleToggle(user.id, !isActive)}
                                                        className={`${isActive ? 'bg-green-400' : 'bg-red-400'} relative inline-flex h-8 w-24 items-center rounded-full transition duration-300`}
                                                    >
                                                        <span className={`absolute left-4 text-white text-sm font-medium transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                                            Active
                                                        </span>
                                                        <span className={`absolute left-8 text-white text-sm font-medium transition-opacity duration-200 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                                                            Inactive
                                                        </span>
                                                        <span className={`${isActive ? 'translate-x-17' : 'translate-x-1'}  h-6 w-6 transform rounded-full bg-white transition-transform duration-300 flex items-center justify-center`}>
                                                            {isActive ? <CheckIcon fontSize='12' /> : <CloseIcon fontSize='12' />}
                                                        </span>
                                                    </Switch>
                                                </div>
                                            </Switch.Group>
                                        </td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Panel;
