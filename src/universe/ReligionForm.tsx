// @ts-nocheck
import React, { useState } from 'react';
import '../tokens.css';

interface ReligionFormProps {
  religion: any;
  onSave: (rel: any) => void;
  onCancel: () => void;
}

const ReligionForm = ({ religion, onSave, onCancel }: ReligionFormProps) => {
  const [formData, setFormData] = useState(
    religion || {
      name: '',
      doctrine: '',
      factions: ''
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ ...formData, id: religion?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {religion ? 'Editar Religião' : 'Nova Religião'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <textarea
            placeholder="Doutrina"
            value={formData.doctrine}
            onChange={(e) => setFormData({ ...formData, doctrine: e.target.value })}
            className="border rounded px-3 py-2 w-full h-24"
          />
          <input
            type="text"
            placeholder="Facções (separadas por vírgula)"
            value={formData.factions}
            onChange={(e) => setFormData({ ...formData, factions: e.target.value })}
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

export default ReligionForm;
