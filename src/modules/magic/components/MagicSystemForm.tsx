import React from 'react';

interface MagicSystemFormProps {
  rules: string;
  onChange: (value: string) => void;
}

const MagicSystemForm: React.FC<MagicSystemFormProps> = ({ rules, onChange }) => {
  return (
    <div className="magic-section">
      <h2>Regras da Magia</h2>
      <textarea
        value={rules}
        onChange={e => onChange(e.target.value)}
        placeholder="Descrição das regras básicas do sistema de magia"
      />
    </div>
  );
};

export default MagicSystemForm;