import React from 'react';
import { Scroll, Save, Sparkles, FileText, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';

interface HeaderProps {
  title: string;
  setTitle: (title: string) => void;
  wordCount: number;
  showWordCount: boolean;
  setShowWordCount: (value: boolean) => void;
  saveVersion: () => void;
  checkGrammar: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  setTitle,
  wordCount,
  showWordCount,
  setShowWordCount,
  saveVersion,
  checkGrammar,
  onExport
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`border-b px-6 py-4`} style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Scroll className="h-8 w-8 text-purple-600" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`text-2xl font-bold bg-transparent border-none outline-none`}
            style={{ color: 'var(--text)' }}
            placeholder="Título da História"
          />
        </div>
        <div className="flex items-center space-x-4">
          {showWordCount && (
            <div className={`text-sm`} style={{ color: 'var(--muted)' }}>
              {wordCount} palavras
            </div>
          )}
          <button
            onClick={saveVersion}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={checkGrammar}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Sparkles className="h-4 w-4" />
          </button>
          <button
            onClick={onExport}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FileText className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowWordCount(!showWordCount)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            {showWordCount ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
