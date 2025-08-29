import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Quote, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Header, Sidebar } from './editor';
import * as dataStore from '../dataStore';
import { createProject, exportToMarkdown } from '../project';
import { useTheme } from './ui/ThemeProvider';

const FictionEditor = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Nova História');
  const [wordCount, setWordCount] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [plotPoints, setPlotPoints] = useState([]);
  const [activePanel, setActivePanel] = useState('editor');
  const [showWordCount, setShowWordCount] = useState(true);
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '', role: '' });
  const [newLocation, setNewLocation] = useState({ name: '', description: '', type: '' });
  const [newPlotPoint, setNewPlotPoint] = useState({ title: '', description: '', chapter: '' });
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [history, setHistory] = useState([]);
  const [grammarSuggestions, setGrammarSuggestions] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isFocus = theme === 'focus';

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  useEffect(() => {
    dataStore.getCharacters().then(setCharacters);
    dataStore.getLocations().then(setLocations);
  }, []);

  const formatText = (command: string, value: any = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const addCharacter = async () => {
    if (newCharacter.name.trim()) {
      const char = { ...newCharacter, id: Date.now() };
      await dataStore.saveCharacter(char);
      setCharacters(await dataStore.getCharacters());
      setNewCharacter({ name: '', description: '', role: '' });
      setShowCharacterForm(false);
    }
  };

  const addLocation = async () => {
    if (newLocation.name.trim()) {
      const loc = { ...newLocation, id: Date.now() };
      await dataStore.saveLocation(loc);
      setLocations(await dataStore.getLocations());
      setNewLocation({ name: '', description: '', type: '' });
      setShowLocationForm(false);
    }
  };

  const addPlotPoint = () => {
    if (newPlotPoint.title.trim()) {
      setPlotPoints([...plotPoints, { ...newPlotPoint, id: Date.now() }]);
      setNewPlotPoint({ title: '', description: '', chapter: '' });
      setShowPlotForm(false);
    }
  };

  const removeItem = (id: number, type: string) => {
    if (type === 'character') {
      setCharacters(characters.filter(char => char.id !== id));
    } else if (type === 'location') {
      setLocations(locations.filter(loc => loc.id !== id));
    } else if (type === 'plot') {
      setPlotPoints(plotPoints.filter(plot => plot.id !== id));
    }
  };

  const insertTemplate = (template: string) => {
    const templates: Record<string, string> = {
      dialogue: '\n\n— Texto do diálogo — disse o personagem, com uma expressão pensativa.\n\n',
      scene: '\n\n[NOVA CENA]\n\nDescrição do ambiente e atmosfera...\n\n',
      chapter: '\n\n═══ CAPÍTULO [NÚMERO] ═══\n[TÍTULO DO CAPÍTULO]\n\n',
      action: '\n\n[Descrição da ação intensa e movimento dos personagens]\n\n'
    };

    const currentContent = editorRef.current?.innerHTML || '';
    if (editorRef.current) {
      editorRef.current.innerHTML = currentContent + templates[template];
    }
    setContent(content + templates[template]);
  };

  const saveVersion = () => {
    setHistory([...history, { content, timestamp: Date.now() }]);
  };

  const loadVersion = (v: any) => {
    setContent(v.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = v.content;
    }
  };

  const exportProject = () => {
    const project = createProject(title);
    project.characters = characters;
    project.locations = locations;
    project.chapters = [{ id: Date.now(), title: 'Capítulo 1', scenes: [{ id: Date.now(), title: 'Cena 1', text: content }] }];
    const md = exportToMarkdown(project);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const checkGrammar = async () => {
    try {
      const res = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ text: content, language: 'pt-BR' }).toString()
      });
      const data = await res.json();
      setGrammarSuggestions(data.matches || []);
    } catch (e) {
      console.error(e);
    }
  };

  const addComment = () => {
    if (newComment.trim()) {
      const pos = window.getSelection()?.anchorOffset || 0;
      setComments([...comments, { id: Date.now(), text: newComment, position: pos }]);
      setNewComment('');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 `}>
      <Header
        title={title}
        setTitle={setTitle}
        wordCount={wordCount}
        showWordCount={showWordCount}
        setShowWordCount={setShowWordCount}
        saveVersion={saveVersion}
        checkGrammar={checkGrammar}
        onExport={exportProject}
      />
      <div className="flex h-screen">
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          characters={characters}
          locations={locations}
          plotPoints={plotPoints}
          showCharacterForm={showCharacterForm}
          setShowCharacterForm={setShowCharacterForm}
          showLocationForm={showLocationForm}
          setShowLocationForm={setShowLocationForm}
          showPlotForm={showPlotForm}
          setShowPlotForm={setShowPlotForm}
          newCharacter={newCharacter}
          setNewCharacter={setNewCharacter}
          addCharacter={addCharacter}
          newLocation={newLocation}
          setNewLocation={setNewLocation}
          addLocation={addLocation}
          newPlotPoint={newPlotPoint}
          setNewPlotPoint={setNewPlotPoint}
          addPlotPoint={addPlotPoint}
          insertTemplate={insertTemplate}
          history={history}
          loadVersion={loadVersion}
          removeItem={removeItem}
        />
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className={`border-b p-4`} style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
            <div className="flex items-center space-x-2 flex-wrap">
              <button
                onClick={() => formatText('bold')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('underline')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Underline className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => formatText('formatBlock', 'blockquote')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('insertUnorderedList')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => formatText('justifyLeft')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('justifyCenter')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('justifyRight')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Writing Area */}
          <div className="flex-1 p-8">
            <div className={`max-w-4xl mx-auto`} style={isFocus ? { background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2rem' } : undefined}>
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                className={`min-h-96 outline-none leading-relaxed text-lg`}
                style={{
                  color: 'var(--text)',
                  fontFamily: isFocus ? 'Georgia, serif' : 'system-ui, sans-serif',
                  lineHeight: '1.8'
                }}
                placeholder="Era uma vez, em uma terra muito distante..."
              />
            </div>
            <div className="max-w-4xl mx-auto mt-8">
              {grammarSuggestions.length > 0 && (
                <div className="mb-4 p-4 border rounded bg-red-50">
                  <h3 className="font-semibold mb-2">Sugestões Gramaticais</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {grammarSuggestions.map((s, idx) => (
                      <li key={idx}>{s.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Comentários</h3>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicionar comentário"
                    className="border p-2 flex-1 rounded"
                  />
                  <button onClick={addComment} className="bg-blue-500 text-white px-3 rounded">
                    Adicionar
                  </button>
                </div>
                <ul className="space-y-1 text-sm">
                  {comments.map(c => (
                    <li key={c.id}>[pos {c.position}] {c.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FictionEditor;
