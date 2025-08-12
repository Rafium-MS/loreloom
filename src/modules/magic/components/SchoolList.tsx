import React, { useState } from 'react';
import { School } from '../services/magicRepository';

interface SchoolListProps {
  schools: School[];
  onAdd: (name: string) => void;
  onUpdate: (school: School) => void;
  onRemove: (id: string) => void;
}

const SchoolList: React.FC<SchoolListProps> = ({ schools, onAdd, onUpdate, onRemove }) => {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName('');
  };

  return (
    <div className="magic-section">
      <h3>Escolas</h3>
      <ul>
        {schools.map(school => (
          <li key={school.id}>
            <input
              value={school.name}
              onChange={e => onUpdate({ ...school, name: e.target.value })}
            />
            <button onClick={() => onRemove(school.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          placeholder="Nova escola"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>
    </div>
  );
};

export default SchoolList;