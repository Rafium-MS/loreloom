// @ts-nocheck
import React, { useState } from 'react';
import '../tokens.css';

interface LanguageFormProps {
  language: any;
  onSave: (lang: any) => void;
  onCancel: () => void;
}

const LanguageForm = ({ language, onSave, onCancel }: LanguageFormProps) => {
  const [formData, setFormData] = useState(
    language || {
      name: '',
      vocabulary: '',
      grammar: '',
      syllables: ''
    }
  );
  const [generatedName, setGeneratedName] = useState('');

  const generateName = () => {
    const syllables = formData.syllables
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (syllables.length === 0) return;
    const count = Math.floor(Math.random() * 2) + 2;
    let name = '';
    for (let i = 0; i < count; i++) {
      name += syllables[Math.floor(Math.random() * syllables.length)];
    }
    setGeneratedName(name.charAt(0).toUpperCase() + name.slice(1));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ ...formData, id: language?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {language ? 'Editar Língua' : 'Nova Língua'}
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
            placeholder="Vocabulário (palavra:tradução por linha)"
            value={formData.vocabulary}
            onChange={(e) => setFormData({ ...formData, vocabulary: e.target.value })}
            className="border rounded px-3 py-2 w-full h-24"
          />
          <textarea
            placeholder="Regras gramaticais"
            value={formData.grammar}
            onChange={(e) => setFormData({ ...formData, grammar: e.target.value })}
            className="border rounded px-3 py-2 w-full h-24"
          />
          <input
            type="text"
            placeholder="Sílabas para gerador (separadas por vírgula)"
            value={formData.syllables}
            onChange={(e) => setFormData({ ...formData, syllables: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
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
