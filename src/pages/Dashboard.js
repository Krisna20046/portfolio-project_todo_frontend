// Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskList from '../components/TaskList';
import { logout } from '../auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
        const res = await api.get('/tasks');
        setTasks(res.data);
        } catch (err) {
        if (err.response.status === 401) {
            logout();
            navigate('/');
        }
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="container">
            <div className="app-container">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Dashboard</h2>
                    <button 
                        className="btn btn-danger" 
                        onClick={() => { logout(); navigate('/'); }}
                    >
                        Logout
                    </button>
                </div>
                <TaskList tasks={tasks} refresh={fetchTasks} />
            </div>
        </div>
    );
};

export default Dashboard;