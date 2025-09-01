import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bold, Italic, Underline, Quote, List, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Heading1, Heading2, Menu } from 'lucide-react';
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
  const [subplots, setSubplots] = useState([]);
  const [charLocations, setCharLocations] = useState([]);
  const [activePanel, setActivePanel] = useState('editor');
  const [showWordCount, setShowWordCount] = useState(true);
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '', role: '' });
  const [newLocation, setNewLocation] = useState({ name: '', description: '', type: '' });
  const [newPlotPoint, setNewPlotPoint] = useState({ title: '', description: '', chapter: '' });
  const [newSubplot, setNewSubplot] = useState({ title: '', description: '', parent: '' });
  const [newRelation, setNewRelation] = useState({ characterId: '', locationId: '' });
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [showSubplotForm, setShowSubplotForm] = useState(false);
  const [showRelationForm, setShowRelationForm] = useState(false);
  const [history, setHistory] = useState([]);
  const [undoStack, setUndoStack] = useState<Descendant[][]>([]);
  const [redoStack, setRedoStack] = useState<Descendant[][]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [grammarSuggestions, setGrammarSuggestions] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { theme } = useTheme();
  const isFocus = theme === 'focus';

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      case 'heading-one':
        return (
          <h1 style={style} {...attributes}>
            {children}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 style={style} {...attributes}>
            {children}
          </h2>
        );
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

  const addSubplot = () => {
    if (newSubplot.title.trim()) {
      setSubplots([
        ...subplots,
        { ...newSubplot, id: Date.now(), parent: newSubplot.parent ? Number(newSubplot.parent) : undefined }
      ]);
      setNewSubplot({ title: '', description: '', parent: '' });
      setShowSubplotForm(false);
    }
  };

  const addRelation = () => {
    if (newRelation.characterId && newRelation.locationId) {
      setCharLocations([
        ...charLocations,
        {
          id: Date.now(),
          characterId: Number(newRelation.characterId),
          locationId: Number(newRelation.locationId)
        }
      ]);
      setNewRelation({ characterId: '', locationId: '' });
      setShowRelationForm(false);
    }
  };

  const removeItem = (id: number, type: string) => {
    if (type === 'character') {
      removeCharacter(id);
    } else if (type === 'location') {
      removeLocation(id);
    } else if (type === 'plot') {
      setPlotPoints(plotPoints.filter(plot => plot.id !== id));
    } else if (type === 'subplot') {
      setSubplots(subplots.filter(sp => sp.id !== id));
    } else if (type === 'relation') {
      setCharLocations(charLocations.filter(rel => rel.id !== id));
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

  const handleChange = (val: Descendant[]) => {
    if (!isApplying) {
      setUndoStack([...undoStack, JSON.parse(JSON.stringify(value))]);
      setRedoStack([]);
    }
    setValue(val);
    if (isApplying) setIsApplying(false);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1];
      setUndoStack(undoStack.slice(0, -1));
      setRedoStack([...redoStack, JSON.parse(JSON.stringify(value))]);
      setIsApplying(true);
      setValue(prev);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setRedoStack(redoStack.slice(0, -1));
      setUndoStack([...undoStack, JSON.parse(JSON.stringify(value))]);
      setIsApplying(true);
      setValue(next);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'z') {
        event.preventDefault();
        undo();
      } else if (event.key === 'y') {
        event.preventDefault();
        redo();
      }
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
      <section className="flex h-screen relative">
        <Sidebar
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 absolute md:relative z-20 h-full top-0 left-0 transition-transform duration-300`}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          characters={characters}
          locations={locations}
          plotPoints={plotPoints}
          subplots={subplots}
          charLocations={charLocations}
          showCharacterForm={showCharacterForm}
          setShowCharacterForm={setShowCharacterForm}
          showLocationForm={showLocationForm}
          setShowLocationForm={setShowLocationForm}
          showPlotForm={showPlotForm}
          setShowPlotForm={setShowPlotForm}
          showSubplotForm={showSubplotForm}
          setShowSubplotForm={setShowSubplotForm}
          showRelationForm={showRelationForm}
          setShowRelationForm={setShowRelationForm}
          newCharacter={newCharacter}
          setNewCharacter={setNewCharacter}
          addCharacter={addCharacter}
          newLocation={newLocation}
          setNewLocation={setNewLocation}
          addLocation={addLocation}
          newPlotPoint={newPlotPoint}
          setNewPlotPoint={setNewPlotPoint}
          addPlotPoint={addPlotPoint}
          newSubplot={newSubplot}
          setNewSubplot={setNewSubplot}
          addSubplot={addSubplot}
          newRelation={newRelation}
          setNewRelation={setNewRelation}
          addRelation={addRelation}
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
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title="Alternar barra lateral"
                aria-label="Alternar barra lateral"
                className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Menu className="h-4 w-4" />
              </button>
              <button
                onClick={undo}
                title="Desfazer (Ctrl+Z)"
                aria-label="Desfazer"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                onClick={redo}
                title="Refazer (Ctrl+Y)"
                aria-label="Refazer"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Redo2 className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => toggleMark('bold')}
                title="Negrito"
                aria-label="Negrito"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleMark('italic')}
                title="Itálico"
                aria-label="Itálico"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleMark('underline')}
                title="Sublinhado"
                aria-label="Sublinhado"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Underline className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => toggleBlock('quote')}
                title="Citação"
                aria-label="Citação"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleBlock('list-item')}
                title="Lista"
                aria-label="Lista"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleBlock('heading-one')}
                title="Cabeçalho 1"
                aria-label="Cabeçalho 1"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleBlock('heading-two')}
                title="Cabeçalho 2"
                aria-label="Cabeçalho 2"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => setAlign('left')}
                title="Alinhar à esquerda"
                aria-label="Alinhar à esquerda"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAlign('center')}
                title="Centralizar"
                aria-label="Centralizar"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAlign('right')}
                title="Alinhar à direita"
                aria-label="Alinhar à direita"
                className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Writing Area */}
          <section className="flex-1 p-8">
            <section
              className={`max-w-4xl mx-auto ${
                isFocus ? 'bg-panel border border-border rounded-lg shadow-token p-8' : ''
              }`}
            >
              <Slate editor={editor} initialValue={value} onChange={handleChange}>
                <Editable
                  className={`min-h-96 outline-none text-lg text-foreground leading-[1.8] ${isFocus ? 'font-serif' : 'font-sans'}`}
                  placeholder="Era uma vez, em uma terra muito distante..."
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={onKeyDown}
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
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-3 rounded-md"
                  >
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
