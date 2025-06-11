// TaskList.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const TaskList = ({ tasks, refresh, project }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [taskData, setTaskData] = useState({ id: null, title: '', user_id: '' });
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await api.get('/users');
        setUsers(res.data);
    };

    const toggleStatus = async (id, done) => {
        await api.put(`/tasks/${id}`, { done: !done });
        refresh();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskData.title || !project) return;

        if (taskData.id) {
        await api.put(`/tasks/${taskData.id}`, {
            title: taskData.title,
            user_id: taskData.user_id
        });
        } else {
        await api.post('/tasks', {
            title: taskData.title,
            project_id: project.id,
            user_id: taskData.user_id
        });
        }

        setTaskData({ id: null, title: '', user_id: '' });
        setIsEditing(false);
        refresh();
    };

    const handleEdit = (task) => {
        setTaskData({ id: task.id, title: task.title, user_id: task.user_id || '' });
        setIsEditing(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="task-section">
            <h3 className="section-title">Daftar Tugas</h3>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className={`task-item ${task.done ? 'completed' : ''}`}>
                        <input 
                            type="checkbox" 
                            className="task-checkbox"
                            checked={task.done} 
                            onChange={() => toggleStatus(task.id, task.done)} 
                        />
                        <div className="task-content">
                            <div className={`task-title ${task.done ? 'completed' : ''}`}>
                                {task.title}
                            </div>
                            <div className="task-assignee">
                                {task.user?.name || 'Belum ditugaskan'}
                            </div>
                        </div>
                        <div className="task-actions">
                            <button 
                                className="btn btn-secondary btn-small" 
                                onClick={() => handleEdit(task)}
                            >
                                Edit
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="form-section">
                <h4 className="form-section-title">
                    {taskData.id ? 'Edit Tugas' : 'Tambah Tugas'}
                </h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                value={taskData.title}
                                placeholder="Judul tugas"
                                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <select
                                className="form-select"
                                value={taskData.user_id}
                                onChange={(e) => setTaskData({ ...taskData, user_id: e.target.value })}
                                required
                            >
                                <option value="">Pilih Penanggung Jawab</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success">
                            {taskData.id ? 'Update' : 'Tambah'}
                        </button>
                        {taskData.id && (
                            <button 
                                type="button" 
                                className="btn btn-outline" 
                                onClick={() => setTaskData({ id: null, title: '', user_id: '' })}
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskList;