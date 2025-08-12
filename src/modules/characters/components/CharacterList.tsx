import React, { useState } from 'react';
import { Character } from '../types';
import CharacterCard from './CharacterCard';

interface Props {
  characters: Character[];
  onEdit?: (character: Character) => void;
  onDelete?: (id: string) => void;
}

const CharacterList: React.FC<Props> = ({ characters, onEdit, onDelete }) => {
  const [query, setQuery] = useState('');

  const filtered = characters.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar..."
        className="w-full p-2 border rounded"
      />
      {filtered.map(char => (
        <CharacterCard
          key={char.id}
          character={char}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum personagem encontrado.</p>
      )}
    </div>
  );
};

export default CharacterList;