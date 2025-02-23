import React from 'react';
import styles from './Flashcards.module.css';

const HintModal = ({ isVisible, onClose, content }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.hintModalOverlay} onClick={onClose}> 
      <div className={styles.hintModal} onClick={(e) => e.stopPropagation()}> 
        <h2>Hint</h2>
        <p>{hintContent}</p>
        <button className={styles.hintCloseButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HintModal;
