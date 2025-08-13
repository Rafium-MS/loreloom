import React from 'react';
import styles from './ArcCard.module.css';
import type { Arc } from '../services/plotRepository';

interface ArcCardProps {
  arc: Arc;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ArcCard: React.FC<ArcCardProps> = ({ arc, isActive, onSelect, onEdit, onDelete }) => {
  return (
    <div className={`${styles.arcCard} ${isActive ? styles.active : ''}`}>
      <h3>{arc.title}</h3>
      <p>{arc.description}</p>
      <div className={styles.progressBar}>
        <div style={{ width: `${arc.progress}%` }}></div>
      </div>
      <p>Status: {arc.status}</p>
      <div className={styles.actStructure}>
        <div>
          <strong>Act 1:</strong> {arc.act1}
        </div>
        <div>
          <strong>Act 2:</strong> {arc.act2}
        </div>
        <div>
          <strong>Act 3:</strong> {arc.act3}
        </div>
      </div>
      {arc.consequences && (
        <p>
          <strong>Consequences:</strong> {arc.consequences}
        </p>
      )}
      <button onClick={onSelect}>Select</button>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default ArcCard;