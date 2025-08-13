import React from 'react';
import styles from './TechSection.module.css';

interface TechSystemFormProps {
  paradigm: string;
  onChange: (value: string) => void;
}

const TechSystemForm: React.FC<TechSystemFormProps> = ({ paradigm, onChange }) => {
  return (
    <div className={styles.techSection}>
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