import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firestore } from "./firebaseConfig";
import { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [sortBy, setSortBy] = useState('wordsTranslated');
    const [isVisible, setIsVisible] = useState(true); // State to manage visibility of leaderboard

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleClose = () => {
        setIsVisible(false); // Close leaderboard when button is clicked
    };

    useEffect(() => {
        const usersQuery = query(
            collection(firestore, "users"),
            orderBy(sortBy, "desc")
        );
    
        const unsubscribe = onSnapshot(usersQuery, async (querySnapshot) => {
            let usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            // Fetch profile picture URLs from Firebase Storage if needed
            const profilePicPromises = usersData.map(async (user) => {
                if (user.profilePicture && !user.profilePicture.startsWith("http")) {
                    try {
                        const storage = getStorage();
                        const profilePicRef = ref(storage, user.profilePicture);
                        user.profilePicture = await getDownloadURL(profilePicRef);
                    } catch (error) {
                        console.error('Error fetching profile picture:', error);
                    }
                }
                return user;
            });
    
            const updatedUsers = await Promise.all(profilePicPromises);
            setUsers(updatedUsers);
        });
    
        return () => unsubscribe();
    }, [sortBy]);

    return (
        <div className={`${styles.container} ${isVisible ? '' : styles.closed}`}>
            <div className={styles.content}>
    
                <button className={styles.closeButton} onClick={handleClose}>X</button>
                <h1 className={styles.title}>Leaderboard</h1>
                <div>
                    <label htmlFor="sort" className={styles.sortLabel}>Sort by: </label>
                    <select id="sort" className={styles.sortSelect} value={sortBy} onChange={handleSortChange}>
                        <option value="wordsTranslated">Words Translated</option>
                        <option value="longestStreak">Max Streak</option>
                        <option value="hintsUsed">Hints Used</option>
                    </select>
                </div>
                
                <div>
                    {users.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <table className={styles.table}>
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
                                    <tr 
                                        key={user.id} 
                                        className={`${index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd} ${styles.mobileRow}`}
                                    >
                                        <td data-label="Rank">{index + 1}</td>
                                        <td data-label="Username">
                                            <div className={styles.userInfo}>
                                                {user.profilePicture ? (
                                                    <img
                                                        src={user.profilePicture || "/default-profile.png"}
                                                        alt={`${user.username}'s profile`}
                                                        className={styles.profilePic}
                                                    />
                                                ) : (
                                                    <div className={styles.defaultProfilePic}>?</div>
                                                )}
                                                {user.username || 'N/A'}
                                            </div>
                                        </td>
                                        <td data-label="Words Translated" className="wordsTranslated">{user.wordsTranslated}</td>
                                        <td data-label="Max Streak" className="longestStreak">{user.longestStreak}</td>
                                        <td data-label="Hints Used" className="hintsUsed">{user.hintsUsed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );    
};

export default Leaderboard;
