// Updated TaskList.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const TaskList = ({ tasks, refresh, project, showProject = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState({ id: null, title: '', assigned_to: '' });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const toggleStatus = async (id, is_completed) => {
    try {
      await api.put(`/tasks/${id}`, { is_completed: !is_completed });
      refresh();
    } catch (err) {
      alert('Gagal mengubah status tugas');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title || !project) return;

    try {
      if (taskData.id) {
        await api.put(`/tasks/${taskData.id}`, {
          title: taskData.title,
          assigned_to: taskData.assigned_to
        });
      } else {
        await api.post('/tasks', {
          title: taskData.title,
          project_id: project.id,
          assigned_to: taskData.assigned_to
        });
      }

      setTaskData({ id: null, title: '', assigned_to: '' });
      setIsEditing(false);
      refresh();
    } catch (err) {
      alert('Gagal menyimpan tugas');
    }
  };

  const handleEdit = (task) => {
    setTaskData({ id: task.id, title: task.title, assigned_to: task.assigned_to || '' });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      try {
        await api.delete(`/tasks/${id}`);
        refresh();
      } catch (err) {
        alert('Gagal menghapus tugas');
      }
    }
  };

  const handleCancel = () => {
    setTaskData({ id: null, title: '', assigned_to: '' });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {/* Task List */}
      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
              <div className="task-content">
                <input 
                  type="checkbox" 
                  className="task-checkbox"
                  checked={task.is_completed} 
                  onChange={() => toggleStatus(task.id, task.is_completed)} 
                />
                <div style={{ flex: 1 }}>
                  <div className="task-title">{task.title}</div>
                  {showProject && task.project && (
                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>
                      📁 {task.project.name}
                    </div>
                  )}
                </div>
                <div className="task-assignee">
                  👤 {task.user?.name || 'Belum ditugaskan'}
                </div>
              </div>
              <div className="task-actions">
                <button 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => handleEdit(task)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDelete(task.id)}
                >
                  🗑️ Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <h4>Belum ada tugas</h4>
          <p>
            {project ? 
              `Proyek "${project.name}" belum memiliki tugas.` :
              'Belum ada tugas yang tersedia.'
            }
          </p>
        </div>
      )}

      {/* Add/Edit Task Form */}
      {project && (
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e6ed' }}>
          <h4>{taskData.id ? '✏️ Edit Tugas' : '➕ Tambah Tugas Baru'}</h4>
          
          <form onSubmit={handleSubmit}>
            <div className="form-inline">
              <div className="form-group">
                <label>Judul Tugas</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskData.title}
                  placeholder="Masukkan judul tugas"
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Penanggung Jawab</label>
                <select
                  className="form-control"
                  value={taskData.assigned_to}
                  onChange={(e) => setTaskData({ ...taskData, assigned_to: e.target.value })}
                  required
                >
                  <option value="">Pilih Penanggung Jawab</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>&nbsp;</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary">
                    {taskData.id ? '💾 Update' : '➕ Tambah'}
                  </button>
                  {taskData.id && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      ❌ Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskList;