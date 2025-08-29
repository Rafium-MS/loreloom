import React from 'react';
import { useTheme } from '../ui/ThemeProvider';

interface CharacterFormProps {
  newCharacter: { name: string; description: string; role: string };
  setNewCharacter: (char: { name: string; description: string; role: string }) => void;
  addCharacter: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ newCharacter, setNewCharacter, addCharacter }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
      <input
        type="text"
        placeholder="Nome do personagem"
        value={newCharacter.name}
        onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
        className={`w-full p-2 mb-2 border rounded ${isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
      />
      <input
        type="text"
        placeholder="Papel/Função"
        value={newCharacter.role}
        onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
        className={`w-full p-2 mb-2 border rounded ${isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
      />
      <textarea
        placeholder="Descrição e características"
        value={newCharacter.description}
        onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
        className={`w-full p-2 mb-2 border rounded h-20 ${isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
      />
      <button
        onClick={addCharacter}
        className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
      >
        Adicionar
      </button>
    </div>
  );
};

export default CharacterForm;
