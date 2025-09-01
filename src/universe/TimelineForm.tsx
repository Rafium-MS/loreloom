import { useState } from 'react';
import '../tokens.css';

export interface TimelineFormData {
  id?: number;
  title: string;
  date: string;
  description: string;
  relations: string;
  era: string;
  importance: string;
  historicMark: string;
}

interface TimelineFormProps {
  event: TimelineFormData | null;
  onSave: (ev: TimelineFormData) => void;
  onCancel: () => void;
}

const TimelineForm = ({ event, onSave, onCancel }: TimelineFormProps) => {
  const [formData, setFormData] = useState(
    (event || { title: '', date: '', description: '', relations: '', era: '', importance: '', historicMark: '' }) as TimelineFormData,
  );
  const [errors, setErrors] = useState({ title: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { title: formData.title.trim() ? '' : 'Título é obrigatório' };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave({ ...formData, id: event?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {event ? 'Editar Evento' : 'Novo Evento'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="timeline-title" className="mb-1 text-sm">Título</label>
            <input
              id="timeline-title"
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ title: '' });
              }}
              className={`border rounded px-3 py-2 w-full ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeline-date" className="mb-1 text-sm">Data</label>
            <input
              id="timeline-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeline-era" className="mb-1 text-sm">Era</label>
            <input
              id="timeline-era"
              type="text"
              value={formData.era}
              onChange={(e) => setFormData({ ...formData, era: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeline-description" className="mb-1 text-sm">Descrição</label>
            <textarea
              id="timeline-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeline-importance" className="mb-1 text-sm">Importância do acontecimento</label>
            <textarea
              id="timeline-importance"
              value={formData.importance}
              onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeline-historic" className="mb-1 text-sm">Marco histórico</label>
            <textarea
              id="timeline-historic"
              value={formData.historicMark}
              onChange={(e) => setFormData({ ...formData, historicMark: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeline-relations" className="mb-1 text-sm">Relacionamentos</label>
            <input
              id="timeline-relations"
              type="text"
              value={formData.relations}
              onChange={(e) => setFormData({ ...formData, relations: e.target.value })}
              className="border rounded px-3 py-2 w-full"
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

export default TimelineForm;
