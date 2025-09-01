// @ts-nocheck
import React, { useState } from 'react';
import '../tokens.css';

interface TimelineFormProps {
  event: any;
  onSave: (ev: any) => void;
  onCancel: () => void;
}

const TimelineForm = ({ event, onSave, onCancel }: TimelineFormProps) => {
  const [formData, setFormData] = useState(
    event || {
      title: '',
      date: '',
      description: '',
      relations: ''
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ ...formData, id: event?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {event ? 'Editar Evento' : 'Novo Evento'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="date"
            placeholder="Data"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <textarea
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border rounded px-3 py-2 w-full h-24"
          />
          <input
            type="text"
            placeholder="Relacionamentos"
            value={formData.relations}
            onChange={(e) => setFormData({ ...formData, relations: e.target.value })}
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

export default TimelineForm;
