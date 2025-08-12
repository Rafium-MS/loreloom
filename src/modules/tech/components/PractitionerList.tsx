import React, { useState } from 'react';
import { Practitioner } from '../services/techRepository';

interface PractitionerListProps {
  practitioners: Practitioner[];
  onAdd: (name: string, type: string) => void;
  onUpdate: (practitioner: Practitioner) => void;
  onRemove: (id: string) => void;
}

const PractitionerList: React.FC<PractitionerListProps> = ({ practitioners, onAdd, onUpdate, onRemove }) => {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim(), newType.trim());
    setNewName('');
    setNewType('');
  };

  return (
    <div className="tech-section">
      <h3>Atores</h3>
      <ul>
        {practitioners.map(p => (
          <li key={p.id}>
            <input
              value={p.name}
              onChange={e => onUpdate({ ...p, name: e.target.value })}
            />
            <input
              value={p.type}
              placeholder="Tipo"
              onChange={e => onUpdate({ ...p, type: e.target.value })}
            />
            <button onClick={() => onRemove(p.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          placeholder="Nome"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          placeholder="Tipo"
          value={newType}
          onChange={e => setNewType(e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>
    </div>
  );
};

export default PractitionerList;
