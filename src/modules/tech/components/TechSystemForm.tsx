import React from 'react';

interface TechSystemFormProps {
  paradigm: string;
  onChange: (value: string) => void;
}

const TechSystemForm: React.FC<TechSystemFormProps> = ({ paradigm, onChange }) => {
  return (
    <div className="tech-section">
      <h2>Paradigma Tecnológico</h2>
      <textarea
        value={paradigm}
        onChange={e => onChange(e.target.value)}
        placeholder="Descrição do paradigma (ex: IA forte, dobra espacial)"
      />
    </div>
  );
};

export default TechSystemForm;