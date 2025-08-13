import React, { useCallback, useMemo, useState } from 'react';
import ModeSwitcher from '../components/ModeSwitcher';
import QuickTemplates from '../components/QuickTemplates';
import RichToolbar from '../components/RichToolbar';
import WritingArea from '../components/WritingArea';
import { templates } from '../utils/templates';
import { exec } from '../utils/formatting';
import useAutosave from '../../../app/core/hooks/useAutosave';
import useHotkeys from '../../../app/core/hooks/useHotkeys';
import StatusBar from '../../../app/core/ui/StatusBar';
import { useAppState } from '../../../app/core/state/store';

const EditorPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'normal' | 'focus' | 'dark'>('normal');

  useAutosave('editor-content', content);

  const setLastSaved = useAppState((s) => s.setLastSaved);
  useHotkeys({
    'ctrl+s': () => {
      localStorage.setItem('editor-content', content);
      setLastSaved(Date.now());
    },
    'ctrl+n': () => setContent(''),
  });

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const handleCommand = useCallback((cmd: string, value?: string) => {
    exec(cmd, value);
  }, []);

  const handleInsertTemplate = (key: string) => {
    setContent((prev) => prev + (templates[key] || ''));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 flex-1">
        <div className="flex items-center gap-4">
          <ModeSwitcher mode={mode} onModeChange={setMode} />
        </div>
        <RichToolbar onCommand={handleCommand} />
        <QuickTemplates onInsert={handleInsertTemplate} />
        <WritingArea value={content} onChange={setContent} mode={mode} />
      </div>
      <StatusBar wordCount={wordCount} />
    </div>
  );
};

export default EditorPage;