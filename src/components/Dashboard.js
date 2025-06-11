// Updated Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskList from './TaskList';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalProjects: 0
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/assigned');
      setTasks(res.data);
      
      // Calculate stats
      const completed = res.data.filter(task => task.is_completed).length;
      setStats({
        totalTasks: res.data.length,
        completedTasks: completed,
        pendingTasks: res.data.length - completed,
        totalProjects: new Set(res.data.map(task => task.project_id)).size
      });
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Ringkasan tugas dan proyek Anda</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#667eea', fontSize: '2rem', marginBottom: '10px' }}>{stats.totalTasks}</h3>
          <p>Total Tugas</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#48bb78', fontSize: '2rem', marginBottom: '10px' }}>{stats.completedTasks}</h3>
          <p>Tugas Selesai</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#f56565', fontSize: '2rem', marginBottom: '10px' }}>{stats.pendingTasks}</h3>
          <p>Tugas Pending</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#764ba2', fontSize: '2rem', marginBottom: '10px' }}>{stats.totalProjects}</h3>
          <p>Total Proyek</p>
        </div>
      </div>

      <div className="card">
        <h3>Tugas Terbaru</h3>
        <TaskList tasks={tasks.slice(0, 10)} refresh={fetchTasks} showProject={true} />
      </div>
    </div>
  );
};
export default Dashboard;