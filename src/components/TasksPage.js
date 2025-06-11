// TasksPage.js - New component for tasks page
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskList from './TaskList';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/assigned');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && task.is_completed) ||
                         (filter === 'pending' && !task.is_completed);
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Semua Tugas</h1>
        <p>Kelola semua tugas dari berbagai proyek</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div className="form-group" style={{ flex: '1', minWidth: '200px', marginBottom: '0' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Cari tugas, penanggung jawab, atau proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              Semua ({tasks.length})
            </button>
            <button
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({tasks.filter(t => !t.is_completed).length})
            </button>
            <button
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('completed')}
            >
              Selesai ({tasks.filter(t => t.is_completed).length})
            </button>
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          <TaskList tasks={filteredTasks} refresh={fetchTasks} showProject={true} />
        ) : (
          <div className="empty-state">
            <h3>Tidak ada tugas ditemukan</h3>
            <p>
              {searchTerm ? 
                `Tidak ada tugas yang cocok dengan pencarian "${searchTerm}"` :
                'Belum ada tugas yang tersedia'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TasksPage;