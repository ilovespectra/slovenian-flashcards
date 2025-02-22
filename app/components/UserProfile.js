"use client";

import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth"; 
import styles from "./UserProfile.module.css";

const UserProfile = ({ user, onClose, firestore }) => {
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || "");
        setPreviewImage(data.profilePicture || "");
      }
    };
    loadUserProfile();
  }, [user, firestore]);

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
        const userRef = doc(firestore, "users", user.uid);
        let profilePictureUrl = previewImage;

        // Upload new profile picture if selected
        if (profilePicture) {
            const storage = getStorage();
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            
            // Upload file and get download URL
            await uploadBytes(storageRef, profilePicture);
            profilePictureUrl = await getDownloadURL(storageRef);
        }

        // Save username and profile picture URL to Firestore
        await setDoc(
            userRef,
            {
                username,
                profilePicture: profilePictureUrl,
            },
            { merge: true }
        );
        console.log("Firestore update complete");
        // Ensure the state updates with the new profile picture URL
        setPreviewImage(profilePictureUrl);

        // Reset profile picture selection
        setProfilePicture(null);

        alert("Profile updated successfully!");
        onClose(); // Close the modal after the update is done
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to update profile.");
    } finally {
        setLoading(false); // Ensure the loading state is reset at the end
    }
};



  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(getAuth()); // Sign out the user
      onClose(); // Close the profile editor
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  console.log("Saving profile for user:", user.uid);
console.log("New username:", username);
console.log("New profile picture:", profilePicture);


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.profileEditor}>
        <h2>Edit Profile</h2>
        <div className={styles.profilePictureContainer}>
          <img
            src={previewImage || "/default-profile.png"}
            alt="Profile"
            className={styles.profilePicture}
          />
          <label htmlFor="profilePictureInput" className={styles.changePictureButton}>
            Update Pfp
          </label>
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
            style={{ display: "none" }}
          />
        </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.usernameInput}
        />
        <button className={styles.saveButton} onClick={saveProfile} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;