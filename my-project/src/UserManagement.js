
import React, { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editUserId, setEditUserId] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();
        const newUser = { username: editUsername, password: editPassword };

        const existingUser = users.find(u => u.username === editUserId);
        const updatedUsers = existingUser ? 
            users.map(u => (u.username === editUserId ? newUser : u)) : 
            [...users, newUser];
            
        localStorage.setItem('users', JSON.stringify(updatedUsers));
       
        resetForm();
        loadUsers();
    };

    const editUser = (username) => {
        const user = users.find(u => u.username === username);
        if (user) {
            setEditUsername(user.username);
            setEditPassword(user.password);
            setEditUserId(user.username);
        }
    };

    const deleteUser = (username) => {
        const updatedUsers = users.filter(u => u.username !== username);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      
        loadUsers();
    };

    const resetForm = () => {
        setEditUsername('');
        setEditPassword('');
        setEditUserId('');
    };

    return (
        <div>
            <h2>User Management</h2>
            <h3>Registered Users</h3>
            <table id="userTable">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => editUser(user.username)}>Edit</button>
                                <button onClick={() => deleteUser(user.username)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Add a New User</h3>
            <form onSubmit={handleUserSubmit}>
                <input type="hidden" value={editUserId} />
                <label>Username:</label>
                <input type="text" value={editUsername} required onChange={e => setEditUsername(e.target.value)} />
                <label>Password:</label>
                <input type="password" value={editPassword} required onChange={e => setEditPassword(e.target.value)} />
                <button type="submit">{editUserId ? 'Update User' : 'Add User'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>
        </div>
    );
};

export default UserManagement;