import React from 'react';

type Objective = {
  id: string;
  description: string;
  completed: boolean;
};

type Quest = {
  id: string;
  title: string;
  description: string;
  type: string;
  objectives: Objective[];
  obstacles: string;
  twists: string;
  rewards: string;
  consequences: string;
  progress: number;
  status: string;
};

interface QuestCardProps {
  quest: Quest;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onEdit, onDelete }) => {
  return (
    <div className="plot-quest-card">
      <h4>{quest.title}</h4>
      <p>{quest.description}</p>
      <p>Type: {quest.type}</p>
      <ul>
        {quest.objectives.map(obj => (
          <li key={obj.id}>
            <input type="checkbox" checked={obj.completed} readOnly /> {obj.description}
          </li>
        ))}
      </ul>
      {quest.obstacles && (
        <p>
          <strong>Obstacles:</strong> {quest.obstacles}
        </p>
      )}
      {quest.twists && (
        <p>
          <strong>Twists:</strong> {quest.twists}
        </p>
      )}
      {quest.rewards && (
        <p>
          <strong>Rewards:</strong> {quest.rewards}
        </p>
      )}
      {quest.consequences && (
        <p>
          <strong>Consequences:</strong> {quest.consequences}
        </p>
      )}
      <div className="plot-progress-bar">
        <div style={{ width: `${quest.progress}%` }}></div>
      </div>
      <p>Status: {quest.status}</p>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default QuestCard;