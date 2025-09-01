// @ts-nocheck
import React, { useState } from 'react';
import '../tokens.css';

interface CharacterFormProps {
  character: any;
  onSave: (char: any) => void;
  onCancel: () => void;
}

const CharacterForm = ({ character, onSave, onCancel }: CharacterFormProps) => {
  const [formData, setFormData] = useState(character || {
    name: '',
    age: '',
    appearance: '',
    background: '',
    abilities: '',
    motivations: '',
    relationships: '',
    role: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ ...formData, id: character?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {character ? 'Editar Personagem' : 'Novo Personagem'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Idade"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="border rounded px-3 py-2"
            />
          </div>
          <textarea
            placeholder="Aparência"
            value={formData.appearance}
            onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
            className="border rounded px-3 py-2 w-full h-20"
          />
          <textarea
            placeholder="Histórico"
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
            className="border rounded px-3 py-2 w-full h-24"
          />
          <textarea
            placeholder="Habilidades"
            value={formData.abilities}
            onChange={(e) => setFormData({ ...formData, abilities: e.target.value })}
            className="border rounded px-3 py-2 w-full h-20"
          />
          <textarea
            placeholder="Motivações"
            value={formData.motivations}
            onChange={(e) => setFormData({ ...formData, motivations: e.target.value })}
            className="border rounded px-3 py-2 w-full h-20"
          />
          <textarea
            placeholder="Relacionamentos"
            value={formData.relationships}
            onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
            className="border rounded px-3 py-2 w-full h-20"
          />
          <input
            type="text"
            placeholder="Papel Narrativo"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterForm;
