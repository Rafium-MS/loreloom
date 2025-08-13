import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [mode, setMode] = useState<'normal' | 'focus' | 'dark'>('normal');

  useAutosave('editor-content', content);

  const setLastSaved = useAppState((s) => s.setLastSaved);
  const setFocusMode = useAppState((s) => s.setFocusMode);
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

  useEffect(() => {
    setFocusMode(mode === 'focus');
  }, [mode, setFocusMode]);

  const handleCommand = useCallback((cmd: string, value?: string) => {
    exec(cmd, value);
  }, []);

  const handleInsertTemplate = (key: string) => {
    setContent((prev) => prev + (templates[key] || ''));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-4">
          <ModeSwitcher mode={mode} onModeChange={setMode} />
          <button
            onClick={() => setShowSummary((s) => !s)}
            className="px-2 py-1 border rounded"
          >
            {showSummary ? 'Ocultar sumário' : 'Mostrar sumário'}
          </button>
        </div>
        <RichToolbar onCommand={handleCommand} />
        <QuickTemplates onInsert={handleInsertTemplate} />
        {showSummary ? (
          <div className="flex flex-1 gap-4">
            <div className="flex-1">
              <WritingArea value={content} onChange={setContent} mode={mode} />
            </div>
            <div className="border-l p-2 resize-x overflow-auto min-w-[16rem] max-w-[32rem]">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full h-full outline-none"
                placeholder="Sumário de cenas..."
              />
            </div>
          </div>
        ) : (
          <WritingArea value={content} onChange={setContent} mode={mode} />
        )}
      </div>
      <StatusBar wordCount={wordCount} />
    </div>
  );
};

export default EditorPage;