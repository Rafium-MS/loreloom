import React from 'react';
import { templateOptions } from '../utils/templates';

interface Props {
  onInsert: (key: string) => void;
}

const QuickTemplates: React.FC<Props> = ({ onInsert }) => {
  return (
    <div>
      {templateOptions.map(t => (
        <button key={t.key} onClick={() => onInsert(t.key)}>{t.label}</button>
      ))}
    </div>
  );
};

export default QuickTemplates;