import React from 'react';

interface Props {
  onCommand: (cmd: string, value?: string) => void;
}

const RichToolbar: React.FC<Props> = ({ onCommand }) => {
  return (
    <div>
      <button onClick={() => onCommand('bold')}>B</button>
      <button onClick={() => onCommand('italic')}>I</button>
      <button onClick={() => onCommand('underline')}>U</button>
      <button onClick={() => onCommand('insertUnorderedList')}>• List</button>
      <button onClick={() => onCommand('justifyLeft')}>Left</button>
      <button onClick={() => onCommand('justifyCenter')}>Center</button>
      <button onClick={() => onCommand('justifyRight')}>Right</button>
    </div>
  );
};

export default RichToolbar;