import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Import Firebase Storage functions
import { firestore } from "./firebaseConfig";
import { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [sortBy, setSortBy] = useState('wordsTranslated'); 

    // Fetch data from Firestore and set the state in real-time
    useEffect(() => {
        const usersQuery = query(
            collection(firestore, "users"),
            orderBy(sortBy, "desc")
        );

        const unsubscribe = onSnapshot(usersQuery, async (querySnapshot) => {
            const usersData = [];

            for (let doc of querySnapshot.docs) {
                const userData = doc.data();
                const userId = doc.id;

                // Check if the user has a profile picture URL in Firebase Storage
                if (userData.profilePicUrl) {
                    try {
                        // Get a reference to the file in Firebase Storage
                        const storage = getStorage();
                        const profilePicRef = ref(storage, userData.profilePicUrl);

                        // Get the download URL for the profile picture
                        const downloadURL = await getDownloadURL(profilePicRef);
                        userData.profilePicUrl = downloadURL;
                    } catch (error) {
                        console.error('Error fetching profile picture:', error);
                    }
                }

                usersData.push({
                    id: userId,
                    ...userData
                });
            }

            setUsers(usersData);
        });

        // Cleanup the listener when the component is unmounted
        return () => unsubscribe();
    }, [sortBy]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <div className={styles.container}>
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
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className={styles.userInfo}>
                                            {/* Profile picture or fallback */}
                                            {user.profilePicUrl ? (
                                                <img
                                                    src={user.profilePicUrl || "/default-profile.png"}
                                                    alt={`${user.username}'s profile`}
                                                    className={styles.profilePic}
                                                />
                                            ) : (
                                                <div className={styles.defaultProfilePic}>?</div>
                                            )}
                                            {user.username || 'N/A'}
                                        </div>
                                    </td>
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
