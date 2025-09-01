import { useState } from 'react';
import '../tokens.css';

export interface LanguageFormData {
  id?: number;
  name: string;
  vocabulary: string;
  grammar: string;
  syllables: string;
  race: string;
}

interface LanguageFormProps {
  language: LanguageFormData | null;
  onSave: (lang: LanguageFormData) => void;
  onCancel: () => void;
}

const LanguageForm = ({ language, onSave, onCancel }: LanguageFormProps) => {
  const [formData, setFormData] = useState(
    (language || { name: '', vocabulary: '', grammar: '', syllables: '', race: '' }) as LanguageFormData,
  );
  const [generatedName, setGeneratedName] = useState('');
  const [errors, setErrors] = useState({ name: '' });

  const generateName = () => {
      const syllables = formData.syllables
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    if (syllables.length === 0) return;
    const count = Math.floor(Math.random() * 2) + 2;
    let name = '';
    for (let i = 0; i < count; i++) {
      name += syllables[Math.floor(Math.random() * syllables.length)];
    }
    setGeneratedName(name.charAt(0).toUpperCase() + name.slice(1));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { name: formData.name.trim() ? '' : 'Nome é obrigatório' };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave({ ...formData, id: language?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {language ? 'Editar Língua' : 'Nova Língua'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="language-name" className="mb-1 text-sm">Nome</label>
            <input
              id="language-name"
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
            <label htmlFor="language-race" className="mb-1 text-sm">Raça ou povo</label>
            <input
              id="language-race"
              type="text"
              value={formData.race}
              onChange={(e) => setFormData({ ...formData, race: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="language-vocab" className="mb-1 text-sm">Vocabulário (palavra:tradução por linha)</label>
            <textarea
              id="language-vocab"
              value={formData.vocabulary}
              onChange={(e) => setFormData({ ...formData, vocabulary: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="language-grammar" className="mb-1 text-sm">Regras gramaticais</label>
            <textarea
              id="language-grammar"
              value={formData.grammar}
              onChange={(e) => setFormData({ ...formData, grammar: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="language-syllables" className="mb-1 text-sm">Sílabas para gerador (separadas por vírgula)</label>
            <input
              id="language-syllables"
              type="text"
              value={formData.syllables}
              onChange={(e) => setFormData({ ...formData, syllables: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {generatedName && (
            <p className="text-sm">Nome gerado: <span className="font-semibold">{generatedName}</span></p>
          )}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={generateName}
              className="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600"
            >
              Gerar Nome
            </button>
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

export default LanguageForm;
