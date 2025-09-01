import { useState } from 'react';
import '../tokens.css';

export interface FactionFormData {
  id?: number;
  name: string;
  intentions: string;
  hierarchy: string;
}

interface FactionFormProps {
  faction: FactionFormData | null;
  onSave: (fac: FactionFormData) => void;
  onCancel: () => void;
}

const FactionForm = ({ faction, onSave, onCancel }: FactionFormProps) => {
  const [formData, setFormData] = useState(
    (faction || { name: '', intentions: '', hierarchy: '' }) as FactionFormData,
  );
  const [errors, setErrors] = useState({ name: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { name: formData.name.trim() ? '' : 'Nome é obrigatório' };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave({ ...formData, id: faction?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {faction ? 'Editar Facção' : 'Nova Facção'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="faction-name" className="mb-1 text-sm">Nome</label>
            <input
              id="faction-name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ name: '' });
              }}
              className={`border rounded px-3 py-2 w-full ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="faction-intentions" className="mb-1 text-sm">Intenções</label>
            <textarea
              id="faction-intentions"
              value={formData.intentions}
              onChange={(e) => setFormData({ ...formData, intentions: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="faction-hierarchy" className="mb-1 text-sm">Hierarquia</label>
            <textarea
              id="faction-hierarchy"
              value={formData.hierarchy}
              onChange={(e) => setFormData({ ...formData, hierarchy: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
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

export default FactionForm;
