import React, { useMemo, useState } from 'react';
import useAutosave from '../../../app/core/hooks/useAutosave';
import useHotkeys from '../../../app/core/hooks/useHotkeys';
import StatusBar from '../../../app/core/ui/StatusBar';
import { useAppState } from '../../../app/core/state/store';

const MagicSystemForm: React.FC = () => {
  const [description, setDescription] = useState('');

  useAutosave('magic-system', description);

  const setLastSaved = useAppState((s) => s.setLastSaved);
  useHotkeys({
    'ctrl+s': () => {
      localStorage.setItem('magic-system', description);
      setLastSaved(Date.now());
    },
    'ctrl+n': () => setDescription(''),
  });

  const wordCount = useMemo(() => {
    return description.trim().split(/\s+/).filter(Boolean).length;
  }, [description]);

  return (
    <div className="flex flex-col h-full">
      <textarea
        className="flex-1 p-4 border"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <StatusBar wordCount={wordCount} />
    </div>
  );
};

export default MagicSystemForm;