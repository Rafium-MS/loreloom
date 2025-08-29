import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Quote, List, AlignLeft, AlignCenter, AlignRight, Save, FileText, BookOpen, Users, MapPin, Sparkles, Eye, EyeOff, PlusCircle, X, Edit3, Scroll } from 'lucide-react';

const FictionEditor = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Nova História');
  const [wordCount, setWordCount] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [plotPoints, setPlotPoints] = useState([]);
  const [activePanel, setActivePanel] = useState('editor');
  const [showWordCount, setShowWordCount] = useState(true);
  const [writingMode, setWritingMode] = useState('normal'); // normal, focus, dark
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
  
  const editorRef = useRef(null);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  useEffect(() => {
    getCharacters().then(setCharacters);
    getLocations().then(setLocations);
  }, []);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const addCharacter = async () => {
    if (newCharacter.name.trim()) {
      const char = { ...newCharacter, id: Date.now() };
      await saveCharacter(char);
      setCharacters(await getCharacters());
      setNewCharacter({ name: '', description: '', role: '' });
      setShowCharacterForm(false);
    }
  };

  const addLocation = async () => {
    if (newLocation.name.trim()) {
      const loc = { ...newLocation, id: Date.now() };
      await saveLocation(loc);
      setLocations(await getLocations());
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

  const removeItem = (id, type) => {
    if (type === 'character') {
      setCharacters(characters.filter(char => char.id !== id));
    } else if (type === 'location') {
      setLocations(locations.filter(loc => loc.id !== id));
    } else if (type === 'plot') {
      setPlotPoints(plotPoints.filter(plot => plot.id !== id));
    }
  };

  const insertTemplate = (template) => {
    const templates = {
      dialogue: '\n\n— Texto do diálogo — disse o personagem, com uma expressão pensativa.\n\n',
      scene: '\n\n[NOVA CENA]\n\nDescrição do ambiente e atmosfera...\n\n',
      chapter: '\n\n═══ CAPÍTULO [NÚMERO] ═══\n[TÍTULO DO CAPÍTULO]\n\n',
      action: '\n\n[Descrição da ação intensa e movimento dos personagens]\n\n'
    };
    
    const currentContent = editorRef.current.innerHTML;
    editorRef.current.innerHTML = currentContent + templates[template];
    setContent(content + templates[template]);
  };

  const saveVersion = () => {
    setHistory([...history, { content, timestamp: Date.now() }]);
  };

  const loadVersion = (v) => {
    setContent(v.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = v.content;
    }
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

  const getThemeClasses = () => {
    switch (writingMode) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'focus':
        return 'bg-amber-50 text-gray-800';
      default:
        return 'bg-white text-gray-900';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 ${writingMode === 'dark' ? 'border-gray-700 bg-gray-800' : writingMode === 'focus' ? 'border-amber-200 bg-amber-100' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Scroll className="h-8 w-8 text-purple-600" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`text-2xl font-bold bg-transparent border-none outline-none ${writingMode === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
              placeholder="Título da História"
            />
          </div>
          <div className="flex items-center space-x-4">
            {showWordCount && (
              <div className={`text-sm ${writingMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {wordCount} palavras
              </div>
            )}
            <button
              onClick={saveVersion}
              className={`p-2 rounded-lg ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={checkGrammar}
              className={`p-2 rounded-lg ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
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
              }}
              className={`p-2 rounded-lg ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowWordCount(!showWordCount)}
              className={`p-2 rounded-lg ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {showWordCount ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`w-80 border-r flex flex-col ${writingMode === 'dark' ? 'border-gray-700 bg-gray-800' : writingMode === 'focus' ? 'border-amber-200 bg-amber-100' : 'border-gray-200 bg-gray-50'}`}>
          {/* Mode Selector */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium mb-2">Modo de Escrita</label>
            <select
              value={writingMode}
              onChange={(e) => setWritingMode(e.target.value)}
              className={`w-full p-2 border rounded-lg ${writingMode === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`}
            >
              <option value="normal">Normal</option>
              <option value="focus">Foco (Pergaminho)</option>
              <option value="dark">Modo Escuro</option>
            </select>
          </div>

          {/* Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'editor', icon: Edit3, label: 'Editor' },
              { id: 'characters', icon: Users, label: 'Personagens' },
              { id: 'locations', icon: MapPin, label: 'Locais' },
              { id: 'plot', icon: BookOpen, label: 'Enredo' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex-1 flex items-center justify-center p-3 text-sm font-medium border-b-2 transition-colors ${
                  activePanel === tab.id 
                    ? 'border-purple-500 text-purple-600' 
                    : `border-transparent ${writingMode === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <tab.icon className="h-4 w-4 mr-1" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
          {activePanel === 'editor' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  Templates Rápidos
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'chapter', label: 'Novo Capítulo' },
                    { key: 'scene', label: 'Nova Cena' },
                    { key: 'dialogue', label: 'Diálogo' },
                    { key: 'action', label: 'Sequência de Ação' }
                  ].map(template => (
                    <button
                      key={template.key}
                      onClick={() => insertTemplate(template.key)}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                        writingMode === 'dark'
                          ? 'hover:bg-gray-700 text-gray-300'
                          : writingMode === 'focus'
                          ? 'hover:bg-amber-200 text-gray-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
              {history.length > 0 && (
                <div>
                  <h3 className="font-semibold mt-4">Histórico</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {history.map((h, idx) => (
                      <li key={h.timestamp}>
                        <button onClick={() => loadVersion(h)} className="text-purple-600 hover:underline">
                          Versão {idx + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

            {activePanel === 'characters' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Personagens</h3>
                  <button
                    onClick={() => setShowCharacterForm(!showCharacterForm)}
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>

                {showCharacterForm && (
                  <div className={`p-3 rounded-lg border ${writingMode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <input
                      type="text"
                      placeholder="Nome do personagem"
                      value={newCharacter.name}
                      onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder="Papel/Função"
                      value={newCharacter.role}
                      onChange={(e) => setNewCharacter({...newCharacter, role: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <textarea
                      placeholder="Descrição e características"
                      value={newCharacter.description}
                      onChange={(e) => setNewCharacter({...newCharacter, description: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded h-20 ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <button
                      onClick={addCharacter}
                      className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                    >
                      Adicionar
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {characters.map(char => (
                    <div key={char.id} className={`p-3 rounded-lg border ${writingMode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{char.name}</h4>
                          {char.role && <p className="text-sm text-purple-600">{char.role}</p>}
                          {char.description && <p className={`text-sm mt-1 ${writingMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{char.description}</p>}
                        </div>
                        <button
                          onClick={() => removeItem(char.id, 'character')}
                          className={`p-1 rounded ${writingMode === 'dark' ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePanel === 'locations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Locais</h3>
                  <button
                    onClick={() => setShowLocationForm(!showLocationForm)}
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>

                {showLocationForm && (
                  <div className={`p-3 rounded-lg border ${writingMode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <input
                      type="text"
                      placeholder="Nome do local"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder="Tipo (cidade, floresta, castelo...)"
                      value={newLocation.type}
                      onChange={(e) => setNewLocation({...newLocation, type: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <textarea
                      placeholder="Descrição do local"
                      value={newLocation.description}
                      onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded h-20 ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <button
                      onClick={addLocation}
                      className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                    >
                      Adicionar
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {locations.map(loc => (
                    <div key={loc.id} className={`p-3 rounded-lg border ${writingMode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{loc.name}</h4>
                          {loc.type && <p className="text-sm text-purple-600">{loc.type}</p>}
                          {loc.description && <p className={`text-sm mt-1 ${writingMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{loc.description}</p>}
                        </div>
                        <button
                          onClick={() => removeItem(loc.id, 'location')}
                          className={`p-1 rounded ${writingMode === 'dark' ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePanel === 'plot' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Pontos do Enredo</h3>
                  <button
                    onClick={() => setShowPlotForm(!showPlotForm)}
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>

                {showPlotForm && (
                  <div className={`p-3 rounded-lg border ${writingMode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <input
                      type="text"
                      placeholder="Título do evento"
                      value={newPlotPoint.title}
                      onChange={(e) => setNewPlotPoint({...newPlotPoint, title: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <input
                      type="text"
                      placeholder="Capítulo/Seção"
                      value={newPlotPoint.chapter}
                      onChange={(e) => setNewPlotPoint({...newPlotPoint, chapter: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <textarea
                      placeholder="Descrição do evento"
                      value={newPlotPoint.description}
                      onChange={(e) => setNewPlotPoint({...newPlotPoint, description: e.target.value})}
                      className={`w-full p-2 mb-2 border rounded h-20 ${writingMode === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                    />
                    <button
                      onClick={addPlotPoint}
                      className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                    >
                      Adicionar
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {plotPoints.map(plot => (
                    <div key={plot.id} className={`p-3 rounded-lg border ${writingMode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{plot.title}</h4>
                          {plot.chapter && <p className="text-sm text-purple-600">Cap. {plot.chapter}</p>}
                          {plot.description && <p className={`text-sm mt-1 ${writingMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{plot.description}</p>}
                        </div>
                        <button
                          onClick={() => removeItem(plot.id, 'plot')}
                          className={`p-1 rounded ${writingMode === 'dark' ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className={`border-b p-4 ${writingMode === 'dark' ? 'border-gray-700 bg-gray-800' : writingMode === 'focus' ? 'border-amber-200 bg-amber-100' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-2 flex-wrap">
              <button
                onClick={() => formatText('bold')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('underline')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Underline className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => formatText('formatBlock', 'blockquote')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('insertUnorderedList')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <button
                onClick={() => formatText('justifyLeft')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('justifyCenter')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                onClick={() => formatText('justifyRight')}
                className={`p-2 rounded-lg transition-colors ${writingMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Writing Area */}
          <div className="flex-1 p-8">
            <div className={`max-w-4xl mx-auto ${writingMode === 'focus' ? 'bg-white rounded-lg shadow-lg p-8' : ''}`}>
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.target.innerHTML)}
                className={`min-h-96 outline-none leading-relaxed text-lg ${
                  writingMode === 'dark'
                    ? 'text-gray-100'
                    : writingMode === 'focus'
                    ? 'text-gray-800 font-serif'
                    : 'text-gray-900'
                }`}
                style={{
                  fontFamily: writingMode === 'focus' ? 'Georgia, serif' : 'system-ui, sans-serif',
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