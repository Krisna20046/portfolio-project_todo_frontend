// ProjectsPage.js - New component for projects page
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskList from './TaskList';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchTasks = async () => {
    if (!selectedProject) return;
    try {
      const res = await api.get('/tasks', {
        params: { project_id: selectedProject.id }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.trim()) return;
    try {
      await api.post('/projects', { name: newProject });
      setNewProject('');
      fetchProjects();
    } catch (err) {
      alert('Gagal membuat proyek');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  return (
    <div>
      <div className="page-header">
        <h1>Manajemen Proyek</h1>
        <p>Kelola proyek dan tugas-tugasnya</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Project List */}
        <div className="card">
          <h3>Daftar Proyek</h3>
          
          <form onSubmit={handleCreateProject} className="form-inline" style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={newProject}
                placeholder="Nama proyek baru"
                onChange={(e) => setNewProject(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Tambah</button>
          </form>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {projects.map(project => (
              <button
                key={project.id}
                className={`project-button ${selectedProject?.id === project.id ? 'active' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                📁 {project.name}
              </button>
            ))}
          </div>
        </div>

        {/* Project Tasks */}
        <div>
          {selectedProject ? (
            <div>
              <div className="active-project">
                <h4>📁 {selectedProject.name}</h4>
              </div>
              <div className="card">
                <TaskList tasks={tasks} refresh={fetchTasks} project={selectedProject} />
              </div>
            </div>
          ) : (
            <div className="card empty-state">
              <h3>Pilih Proyek</h3>
              <p>Pilih proyek dari daftar di sebelah kiri untuk melihat tugas-tugasnya</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProjectsPage;