import React, { useEffect, useState } from 'react';
import { Character } from '../types';
import CharacterForm from '../components/CharacterForm';
import CharacterList from '../components/CharacterList';
import { addCharacter, deleteCharacter, getCharacters, updateCharacter } from '../services/characterRepository';
import Skeleton from '../../../app/core/ui/Skeleton';
import EmptyState from '../../../app/core/ui/EmptyState';
import { useToast } from '../../../app/core/ui/Toast';


const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | undefined>();
  const { addToast } = useToast();

  useEffect(() => {
    setCharacters(getCharacters());
    setLoading(false);
  }, []);

  const handleSave = (character: Character) => {
    try {
      if (characters.find(c => c.id === character.id)) {
        updateCharacter(character);
        setCharacters(chars => chars.map(c => (c.id === character.id ? character : c)));
      } else {
        addCharacter(character);
        setCharacters(chars => [...chars, character]);
      }
      addToast({ type: 'success', message: 'Personagem salvo.' });
      setShowForm(false);
      setEditingCharacter(undefined);
    } catch {
      addToast({ type: 'error', message: 'Erro ao salvar personagem.' });
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteCharacter(id);
      setCharacters(chars => chars.filter(c => c.id !== id));
      addToast({ type: 'success', message: 'Personagem removido.' });
    } catch {
      addToast({ type: 'error', message: 'Erro ao remover personagem.' });
    }
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
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : characters.length === 0 ? (
        <EmptyState
          message="Nenhum personagem. Crie o primeiro."
          actionLabel="Novo Personagem"
          onAction={handleNew}
        />
      ) : (
        <CharacterList
          characters={characters}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default CharactersPage;
