// UsersPage.js - New component for users management
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await api.get('/me');
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      alert('Gagal mengubah role');
    }
  };

  useEffect(() => {
    fetchMe();
    fetchUsers();
  }, []);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="card empty-state">
        <h3>Akses Ditolak</h3>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Manajemen Pengguna</h1>
        <p>Kelola pengguna dan role mereka</p>
      </div>

      <div className="card">
        <h3>Daftar Pengguna</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                    {user.id === currentUser.id && (
                      <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#667eea' }}>
                        (Anda)
                      </span>
                    )}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-member'}`}>
                      {user.role === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="form-control"
                      style={{ width: 'auto', minWidth: '120px' }}
                      disabled={user.id === currentUser.id}
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
    </div>
  );
};

export default UsersPage;
