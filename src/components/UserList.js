// UserList.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const fetchMe = async () => {
    const res = await api.get('/me');
    setCurrentUser(res.data);
  };

  const changeRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    fetchUsers();
  };

  useEffect(() => {
    fetchMe();
    fetchUsers();
  }, []);

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <div className="container">
      <div className="app-container">
        <h3 className="section-title">Manajemen Pengguna</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Ganti Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;