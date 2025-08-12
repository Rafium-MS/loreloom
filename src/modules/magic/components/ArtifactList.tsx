import React, { useState } from 'react';
import { Artifact } from '../services/magicRepository';

interface ArtifactListProps {
  artifacts: Artifact[];
  onAdd: (artifact: Omit<Artifact, 'id'>) => void;
  onUpdate: (artifact: Artifact) => void;
  onRemove: (id: string) => void;
}

const ArtifactList: React.FC<ArtifactListProps> = ({ artifacts, onAdd, onUpdate, onRemove }) => {
  const [form, setForm] = useState<Omit<Artifact, 'id'>>({ name: '', description: '' });

  const updateForm = (field: keyof Omit<Artifact, 'id'>, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd(form);
    setForm({ name: '', description: '' });
  };

  return (
    <div className="magic-section">
      <h3>Artefatos</h3>
      <ul>
        {artifacts.map(artifact => (
          <li key={artifact.id}>
            <input
              value={artifact.name}
              onChange={e => onUpdate({ ...artifact, name: e.target.value })}
            />
            <input
              placeholder="Descrição"
              value={artifact.description}
              onChange={e => onUpdate({ ...artifact, description: e.target.value })}
            />
            <button onClick={() => onRemove(artifact.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={e => updateForm('name', e.target.value)}
        />
        <input
          placeholder="Descrição"
          value={form.description}
          onChange={e => updateForm('description', e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>
    </div>
  );
};

export default ArtifactList;