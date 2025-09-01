import { useState } from 'react';
import '../tokens.css';

export interface EconomyFormData {
  id?: number;
  name: string;
  currency: string;
  markets: string;
  mainExports: string;
  basicItems: string;
  goods: string;
}

interface EconomyFormProps {
  economy: EconomyFormData | null;
  onSave: (econ: EconomyFormData) => void;
  onCancel: () => void;
}

const EconomyForm = ({ economy, onSave, onCancel }: EconomyFormProps) => {
  const [formData, setFormData] = useState(
    (economy || { name: '', currency: '', markets: '', mainExports: '', basicItems: '', goods: '' }) as EconomyFormData,
  );
  const [errors, setErrors] = useState({ name: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { name: formData.name.trim() ? '' : 'Nome é obrigatório' };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave({ ...formData, id: economy?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {economy ? 'Editar Economia' : 'Nova Economia'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="economy-name" className="mb-1 text-sm">Nome</label>
            <input
              id="economy-name"
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
            <label htmlFor="economy-currency" className="mb-1 text-sm">Moeda</label>
            <input
              id="economy-currency"
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="economy-markets" className="mb-1 text-sm">Mercados principais</label>
            <input
              id="economy-markets"
              type="text"
              value={formData.markets}
              onChange={(e) => setFormData({ ...formData, markets: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="economy-exports" className="mb-1 text-sm">Exportações</label>
            <input
              id="economy-exports"
              type="text"
              value={formData.mainExports}
              onChange={(e) => setFormData({ ...formData, mainExports: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="economy-basic" className="mb-1 text-sm">Valores de itens básicos</label>
            <textarea
              id="economy-basic"
              value={formData.basicItems}
              onChange={(e) => setFormData({ ...formData, basicItems: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="economy-goods" className="mb-1 text-sm">Mercadorias</label>
            <textarea
              id="economy-goods"
              value={formData.goods}
              onChange={(e) => setFormData({ ...formData, goods: e.target.value })}
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

export default EconomyForm;
