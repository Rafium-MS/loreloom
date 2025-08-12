import React, { useCallback, useMemo, useState } from 'react';
import ModeSwitcher from '../components/ModeSwitcher';
import QuickTemplates from '../components/QuickTemplates';
import RichToolbar from '../components/RichToolbar';
import WritingArea from '../components/WritingArea';
import { templates } from '../utils/templates';
import { exec } from '../utils/formatting';
import useAutosave from '../../../app/core/hooks/useAutosave';

const EditorPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'normal' | 'focus' | 'dark'>('normal');
  const [showCount, setShowCount] = useState(true);

  useAutosave('editor-content', content);

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const handleCommand = useCallback((cmd: string, value?: string) => {
    exec(cmd, value);
  }, []);

  const handleInsertTemplate = (key: string) => {
    setContent(prev => prev + (templates[key] || ''));
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-4">
        <ModeSwitcher mode={mode} onModeChange={setMode} />
        {showCount && <span>{wordCount} palavras</span>}
        <button onClick={() => setShowCount(!showCount)}>
          {showCount ? 'Ocultar' : 'Mostrar'} contagem
        </button>
      </div>
      <RichToolbar onCommand={handleCommand} />
      <QuickTemplates onInsert={handleInsertTemplate} />
      <WritingArea value={content} onChange={setContent} mode={mode} />
    </div>
  );
};

export default EditorPage;