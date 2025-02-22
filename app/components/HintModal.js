import React from 'react';
import styles from './Flashcards.module.css'; // Make sure to use the CSS module import

const HintModal = ({ isVisible, onClose, content }) => {
  if (!isVisible) return null; // Don't render anything if the modal is not visible

  return (
    <div className={styles.modalOverlay} onClick={onClose}> {/* Use the modal-overlay class */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}> {/* Prevent clicking the modal from closing */}
        <h2>Hint</h2>
        <p>{content}</p>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HintModal;
