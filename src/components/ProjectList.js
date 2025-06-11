// ProjectList.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ProjectList = ({ onProjectSelect }) => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState('');

    const fetchProjects = async () => {
        const res = await api.get('/projects');
        setProjects(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newProject.trim()) return;
        await api.post('/projects', { name: newProject });
        setNewProject('');
        fetchProjects();
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="project-section">
            <h3 className="section-title">Proyek</h3>
            <div className="project-list">
                {projects.map(p => (
                    <button 
                        key={p.id} 
                        className="project-item"
                        onClick={() => onProjectSelect(p)}
                    >
                        {p.name}
                    </button>
                ))}
            </div>
            <form className="project-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    className="form-input"
                    value={newProject}
                    placeholder="Nama proyek"
                    onChange={(e) => setNewProject(e.target.value)}
                />
                <button type="submit" className="btn btn-success">Tambah Proyek</button>
            </form>
        </div>
    );
};

export default ProjectList;