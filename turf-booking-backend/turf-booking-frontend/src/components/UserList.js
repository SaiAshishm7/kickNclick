import React from 'react';
import axios from 'axios';

function UserList({ users, token, setUsers }) {
  const changeRole = async (id, role) => {
    await axios.put(
      `http://localhost:5000/api/admin/users/${id}`,
      { role },
      { headers: { Authorization: token } }
    );

    setUsers(users.map(user => user._id === id ? { ...user, role } : user));
  };

  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                {user.role === 'user' ? (
                  <button onClick={() => changeRole(user._id, 'admin')}>Make Admin</button>
                ) : (
                  <button onClick={() => changeRole(user._id, 'user')}>Revoke Admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
