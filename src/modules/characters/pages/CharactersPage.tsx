import React, { useState } from 'react';
import { Character } from '../types';
import CharacterForm from '../components/CharacterForm';
import CharacterList from '../components/CharacterList';
import { addCharacter, deleteCharacter, getCharacters, updateCharacter } from '../services/characterRepository';

const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(() => getCharacters());
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | undefined>();

  const handleSave = (character: Character) => {
    if (characters.find(c => c.id === character.id)) {
      updateCharacter(character);
      setCharacters(chars => chars.map(c => (c.id === character.id ? character : c)));
    } else {
      addCharacter(character);
      setCharacters(chars => [...chars, character]);
    }
    setShowForm(false);
    setEditingCharacter(undefined);
  };

  const handleDelete = (id: string) => {
    deleteCharacter(id);
    setCharacters(chars => chars.filter(c => c.id !== id));
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingCharacter(undefined);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCharacter(undefined);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Personagens</h2>
      {showForm ? (
        <CharacterForm
          initialCharacter={editingCharacter}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <button
          onClick={handleNew}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Novo Personagem
        </button>
      )}
      <CharacterList
        characters={characters}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CharactersPage;