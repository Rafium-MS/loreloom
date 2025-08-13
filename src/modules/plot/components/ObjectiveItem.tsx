import React from 'react';
import { Objective } from '../services/plotRepository';
import styles from './ObjectiveItem.module.css';

interface ObjectiveItemProps {
  objective: Objective;
  onChange: (objective: Objective) => void;
  onRemove: (id: string) => void;
}

const ObjectiveItem: React.FC<ObjectiveItemProps> = ({ objective, onChange, onRemove }) => {
  return (
    <div className={styles.objectiveItem}>
      <input
        type="checkbox"
        checked={objective.completed}
        onChange={() => onChange({ ...objective, completed: !objective.completed })}
      />
      <input
        type="text"
        value={objective.description}
        onChange={e => onChange({ ...objective, description: e.target.value })}
        placeholder="Objective description"
      />
      <button onClick={() => onRemove(objective.id)}>Remove</button>
    </div>
  );
};

export default ObjectiveItem;