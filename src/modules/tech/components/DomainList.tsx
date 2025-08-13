import React, { useState } from 'react';
import { Domain } from '../services/techRepository';
import styles from './TechSection.module.css';

interface DomainListProps {
  domains: Domain[];
  onAdd: (name: string) => void;
  onUpdate: (domain: Domain) => void;
  onRemove: (id: string) => void;
}

const DomainList: React.FC<DomainListProps> = ({ domains, onAdd, onUpdate, onRemove }) => {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName('');
  };

  return (
    <div className={styles.techSection}>
      <h3>Domínios</h3>
      <ul>
        {domains.map(domain => (
          <li key={domain.id}>
            <input
              value={domain.name}
              onChange={e => onUpdate({ ...domain, name: e.target.value })}
            />
            <button onClick={() => onRemove(domain.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          placeholder="Novo domínio"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>
    </div>
  );
};

export default DomainList;