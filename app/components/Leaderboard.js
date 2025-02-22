// Import Firestore functions
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { firestore } from "./firebase";
import { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [sortBy, setSortBy] = useState('wordsTranslated'); 

    // Fetch data from Firestore and set the state
    useEffect(() => {
        const fetchUsers = async () => {
            const usersQuery = query(
                collection(firestore, "users"),
                orderBy(sortBy, "desc") 
            );
            const querySnapshot = await getDocs(usersQuery);
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        };

        fetchUsers();
    }, [sortBy]); 

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <div>
            <h1>Leaderboard</h1>
            <div>
                <label htmlFor="sort">Sort by: </label>
                <select id="sort" value={sortBy} onChange={handleSortChange}>
                    <option value="wordsTranslated">Words Translated</option>
                    <option value="longestStreak">Max Streak</option>
                    <option value="hintsUsed">Hints Used</option>
                </select>
            </div>
            
            <div>
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Words Translated</th>
                                <th>Max Streak</th>
                                <th>Hints Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.username || 'N/A'}</td>
                                    <td>{user.wordsTranslated}</td>
                                    <td>{user.longestStreak}</td>
                                    <td>{user.hintsUsed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
