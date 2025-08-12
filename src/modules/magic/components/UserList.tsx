import React, { useState } from 'react';
import { User } from '../services/magicRepository';

interface UserListProps {
  users: User[];
  onAdd: (name: string, role: string) => void;
  onUpdate: (user: User) => void;
  onRemove: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onAdd, onUpdate, onRemove }) => {
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim(), newRole.trim());
    setNewName('');
    setNewRole('');
  };

  return (
    <div className="magic-section">
      <h3>Usuários</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <input
              value={user.name}
              onChange={e => onUpdate({ ...user, name: e.target.value })}
            />
            <input
              placeholder="Função"
              value={user.role}
              onChange={e => onUpdate({ ...user, role: e.target.value })}
            />
            <button onClick={() => onRemove(user.id)}>Remover</button>
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
          placeholder="Função"
          value={newRole}
          onChange={e => setNewRole(e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>
    </div>
  );
};

export default UserList;