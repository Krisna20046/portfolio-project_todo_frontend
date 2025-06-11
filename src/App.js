// App.js
import React, { useEffect, useState } from 'react';
import api from './api/axios';
import TaskList from './components/TaskList';
import ProjectList from './components/ProjectList';
import './App.css'; // Import the CSS file

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchTasks = async () => {
    if (!selectedProject) return;
    const res = await api.get('/tasks', {
      params: { project_id: selectedProject.id }
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  return (
    <div className="container">
      <div className="app-container">
        <h2 className="app-title">Manajemen Tugas (To-Do List)</h2>
        <ProjectList onProjectSelect={setSelectedProject} />
        {selectedProject && (
          <>
            <div className="active-project">
              <h4>Proyek Aktif: {selectedProject.name}</h4>
            </div>
            <TaskList tasks={tasks} refresh={fetchTasks} project={selectedProject} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;