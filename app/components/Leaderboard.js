'use client'; 
// Leaderboard.js
import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Ensure the path is correct
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import styles from './Leaderboard.module.css'; // Create this file for styling

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [sortBy, setSortBy] = useState('wordsTranslated'); // Default sorting
    const [editingUserId, setEditingUserId] = useState(null);
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersCollection = collection(firestore, 'users');
                let q = query(usersCollection, orderBy(sortBy, 'desc')); // Sort by default criterion
                const querySnapshot = await getDocs(q);
                const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchData();
    }, [sortBy]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleEditClick = (userId, currentUsername) => {
        setEditingUserId(userId);
        setNewUsername(currentUsername);
    };

    const handleUsernameChange = async (e) => {
        e.preventDefault();
        if (!newUsername.trim()) return; // Validate input

        try {
            const userDoc = doc(firestore, 'users', editingUserId);
            await updateDoc(userDoc, { username: newUsername });
            // Reset the editing state
            setEditingUserId(null);
            setNewUsername('');
            // Refresh user data
            const usersCollection = collection(firestore, 'users');
            let q = query(usersCollection, orderBy(sortBy, 'desc'));
            const querySnapshot = await getDocs(q);
            const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userData);
        } catch (error) {
            console.error('Error updating username:', error);
        }
    };

    return (
        <div className={styles.leaderboard}>
            <h2>Leaderboard</h2>
            <select className={styles.sortSelect} onChange={handleSortChange} value={sortBy}>
                <option value="wordsTranslated">Words Translated</option>
                <option value="longestStreak">Longest Streak</option>
                <option value="hintsUsed">Least Hints</option>
            </select>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Words Translated</th>
                        <th>Longest Streak</th>
                        <th>Hints Used</th>
                        <th>Actions</th> {/* Added column for actions */}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                {editingUserId === user.id ? (
                                    <form onSubmit={handleUsernameChange}>
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            required
                                        />
                                        <button type="submit">Save</button>
                                    </form>
                                ) : (
                                    user.username || user.id
                                )}
                            </td>
                            <td>{user.wordsTranslated || 0}</td>
                            <td>{user.longestStreak || 0}</td>
                            <td>{user.hintsUsed || 0}</td>
                            <td>
                                {editingUserId === user.id ? (
                                    <button onClick={() => setEditingUserId(null)}>Cancel</button>
                                ) : (
                                    <button onClick={() => handleEditClick(user.id, user.username)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
