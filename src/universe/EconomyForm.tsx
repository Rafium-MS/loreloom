// @ts-nocheck
import React, { useState } from 'react';
import '../tokens.css';

interface EconomyFormProps {
  economy: any;
  onSave: (econ: any) => void;
  onCancel: () => void;
}

const EconomyForm = ({ economy, onSave, onCancel }: EconomyFormProps) => {
  const [formData, setFormData] = useState(
    economy || {
      name: '',
      currency: '',
      markets: '',
      mainExports: ''
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ ...formData, id: economy?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {economy ? 'Editar Economia' : 'Nova Economia'}
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
          <input
            type="text"
            placeholder="Moeda"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Mercados principais"
            value={formData.markets}
            onChange={(e) => setFormData({ ...formData, markets: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Exportações"
            value={formData.mainExports}
            onChange={(e) => setFormData({ ...formData, mainExports: e.target.value })}
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

export default EconomyForm;
