import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import CharacterCard from './CharacterCard';
import VirtualList from '../../../app/core/ui/VirtualList';
import localStorageAdapter from '../../../app/core/services/persistence/localStorageAdapter';

interface Props {
  characters: Character[];
  onEdit?: (character: Character) => void;
  onDelete?: (id: string) => void;
}

const CharacterList: React.FC<Props> = ({ characters, onEdit, onDelete }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const saved = await localStorageAdapter.get<string>('characters:query');
      if (saved) setQuery(saved);
    })();
  }, []);

  useEffect(() => {
    localStorageAdapter.set('characters:query', query);
  }, [query]);

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
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum personagem encontrado.</p>
      ) : (
        <VirtualList
          items={filtered}
          height={400}
          itemHeight={120}
          render={char => (
            <div className="mb-2">
              <CharacterCard
                key={char.id}
                character={char}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          )}
        />
      )}
    </div>
  );
};

export default CharacterList;