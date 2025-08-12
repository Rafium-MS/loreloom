import React from 'react';
import { Character } from '../types';

interface Props {
  character: Character;
  onEdit?: (character: Character) => void;
  onDelete?: (id: string) => void;
}

const CharacterCard: React.FC<Props> = ({ character, onEdit, onDelete }) => {
  return (
    <div className="border p-3 rounded">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{character.name}</h4>
          {character.role && <p className="text-sm text-purple-600">{character.role}</p>}
          {character.description && <p className="text-sm mt-1">{character.description}</p>}
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(character)}
              className="text-blue-600 text-sm"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(character.id)}
              className="text-red-600 text-sm"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;