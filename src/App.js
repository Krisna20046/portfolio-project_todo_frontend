// App.js - Updated with Layout and Routing
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api/axios';
import { getToken } from './auth';

// Components
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectsPage from './components/ProjectsPage';
import TasksPage from './components/TasksPage';
import UsersPage from './components/UsersPage';

// Import CSS
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (getToken()) {
        const res = await api.get('/me');
        setCurrentUser(res.data);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={!currentUser ? <Login onLogin={fetchCurrentUser} /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Protected Routes */}
        {currentUser ? (
          <Route path="/*" element={
            <Layout currentUser={currentUser}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                {currentUser.role === 'admin' && (
                  <Route path="/users" element={<UsersPage />} />
                )}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          } />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;