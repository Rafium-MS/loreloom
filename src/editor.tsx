import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bold, Italic, Underline, Quote, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
// Import from the editor folder's index to avoid self-importing this file
import { Header, Sidebar } from './editor/index';
import { createProject, exportToMarkdown } from '../project';
import { useTheme } from './ui/ThemeProvider';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Descendant, Transforms, Editor, Node } from 'slate';
import { useCharacters } from './hooks/useCharacters';
import { useLocations } from './hooks/useLocations';
import './tokens.css';

const FictionEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    { type: 'paragraph', children: [{ text: '' }] },
  ]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Nova História');
  const [wordCount, setWordCount] = useState(0);
  const { characters, saveCharacter, removeCharacter } = useCharacters();
  const { locations, saveLocation, removeLocation } = useLocations();
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

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isFocus = theme === 'focus';

  useEffect(() => {
    const text = value.map((n) => Node.string(n)).join('\n');
    setContent(text);
  }, [value]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isMarkActive = (format: string) => {
    const marks: any = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    Transforms.setNodes(editor, { type: isActive ? 'paragraph' : format } as any, {
      match: (n) => Editor.isBlock(editor, n),
    });
  };

  const isBlockActive = (format: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && (n as any).type === format,
    });
    return !!match;
  };

  const setAlign = (align: 'left' | 'center' | 'right') => {
    Transforms.setNodes(editor, { align }, { match: (n) => Editor.isBlock(editor, n) });
  };

  const Element = ({ attributes, children, element }: any) => {
    const style = { textAlign: element.align } as React.CSSProperties;
    switch (element.type) {
      case 'quote':
        return (
          <blockquote style={style} {...attributes}>
            {children}
          </blockquote>
        );
      case 'list-item':
        return (
          <p
            style={{ ...style, display: 'list-item', listStyleType: 'disc', marginLeft: '1.5em' }}
            {...attributes}
          >
            {children}
          </p>
        );
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        );
    }
  };

  const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    return <span {...attributes}>{children}</span>;
  };

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const addCharacter = async () => {
    if (newCharacter.name.trim()) {
      const char = { ...newCharacter, id: Date.now() };
      await saveCharacter(char);
      setNewCharacter({ name: '', description: '', role: '' });
      setShowCharacterForm(false);
    }
  };

  const addLocation = async () => {
    if (newLocation.name.trim()) {
      const loc = { ...newLocation, id: Date.now() };
      await saveLocation(loc);
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
      removeCharacter(id);
    } else if (type === 'location') {
      removeLocation(id);
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

    Transforms.insertText(editor, templates[template]);
  };

  const saveVersion = () => {
    setHistory([...history, { content, timestamp: Date.now() }]);
  };

  const loadVersion = (v: any) => {
    const nodes: Descendant[] = [{ type: 'paragraph', children: [{ text: v.content }] }];
    setValue(nodes);
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
    <main className={`min-h-screen transition-colors duration-300 `}>
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
      <section className="flex h-screen">
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
        <section className="flex-1 flex flex-col">
          {/* Toolbar */}
          <header className={`border-b p-4 bg-panel border-border`}>
            <div className="flex items-center space-x-2 flex-wrap">
              <button
                onClick={() => toggleMark('bold')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleMark('italic')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleMark('underline')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Underline className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => toggleBlock('quote')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleBlock('list-item')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => setAlign('left')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAlign('center')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAlign('right')}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Writing Area */}
          <section className="flex-1 p-8">
            <section className={`max-w-4xl mx-auto ${isFocus ? 'theme-surface p-8' : ''}`}>
              <Slate editor={editor} value={value} onChange={setValue}>
                <Editable
                  className={`min-h-96 outline-none text-lg text-text leading-1-8 ${isFocus ? 'font-serif' : 'font-sans'}`}
                  placeholder="Era uma vez, em uma terra muito distante..."
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                />
              </Slate>
            </section>
            <section className="max-w-4xl mx-auto mt-8">
              {grammarSuggestions.length > 0 && (
                <section className="mb-4 p-4 border rounded bg-red-50">
                  <h3 className="font-semibold mb-2">Sugestões Gramaticais</h3>
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {grammarSuggestions.map((s, idx) => (
                      <li key={idx}>{s.message}</li>
                    ))}
                  </ul>
                </section>
              )}
              <section>
                <h3 className="font-semibold mb-2">Comentários</h3>
                <form
                  className="flex space-x-2 mb-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addComment();
                  }}
                >
                  <label htmlFor="newComment" className="sr-only">
                    Novo comentário
                  </label>
                  <input
                    id="newComment"
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicionar comentário"
                    className="border p-2 flex-1 rounded"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-3 rounded">
                    Adicionar
                  </button>
                </form>
                <ul className="space-y-1 text-sm">
                  {comments.map(c => (
                    <li key={c.id}>[pos {c.position}] {c.text}</li>
                  ))}
                </ul>
              </section>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
};

export default FictionEditor;
