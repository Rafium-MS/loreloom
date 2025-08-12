import React from 'react';

interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

const ModeSwitcher: React.FC<Props> = ({ mode, onModeChange }) => {
  return (
    <select value={mode} onChange={e => onModeChange(e.target.value)}>
      <option value="normal">Normal</option>
      <option value="focus">Foco</option>
      <option value="dark">Escuro</option>
    </select>
  );
};

export default ModeSwitcher;