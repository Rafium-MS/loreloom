import React, { useState } from 'react';
import { Users, MapPin, BookOpen, Edit3, PlusCircle, X, Sparkles, Link2 } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';
import CharacterForm from './CharacterForm';

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  characters: any[];
  locations: any[];
  plotPoints: any[];
  subplots: any[];
  charLocations: any[];
  showCharacterForm: boolean;
  setShowCharacterForm: (value: boolean) => void;
  showLocationForm: boolean;
  setShowLocationForm: (value: boolean) => void;
  showPlotForm: boolean;
  setShowPlotForm: (value: boolean) => void;
  showSubplotForm: boolean;
  setShowSubplotForm: (value: boolean) => void;
  showRelationForm: boolean;
  setShowRelationForm: (value: boolean) => void;
  newCharacter: { name: string; description: string; role: string };
  setNewCharacter: (char: { name: string; description: string; role: string }) => void;
  addCharacter: () => void;
  newLocation: { name: string; description: string; type: string };
  setNewLocation: (loc: { name: string; description: string; type: string }) => void;
  addLocation: () => void;
  newPlotPoint: { title: string; description: string; chapter: string };
  setNewPlotPoint: (plot: { title: string; description: string; chapter: string }) => void;
  addPlotPoint: () => void;
  newSubplot: { title: string; description: string; parent: string };
  setNewSubplot: (sp: { title: string; description: string; parent: string }) => void;
  addSubplot: () => void;
  newRelation: { characterId: string; locationId: string };
  setNewRelation: (r: { characterId: string; locationId: string }) => void;
  addRelation: () => void;
  insertTemplate: (template: string) => void;
  history: any[];
  loadVersion: (v: any) => void;
  removeItem: (id: number, type: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePanel,
  setActivePanel,
  characters,
  locations,
  plotPoints,
  subplots,
  charLocations,
  showCharacterForm,
  setShowCharacterForm,
  showLocationForm,
  setShowLocationForm,
  showPlotForm,
  setShowPlotForm,
  showSubplotForm,
  setShowSubplotForm,
  showRelationForm,
  setShowRelationForm,
  newCharacter,
  setNewCharacter,
  addCharacter,
  newLocation,
  setNewLocation,
  addLocation,
  newPlotPoint,
  setNewPlotPoint,
  addPlotPoint,
  newSubplot,
  setNewSubplot,
  addSubplot,
  newRelation,
  setNewRelation,
  addRelation,
  insertTemplate,
  history,
  loadVersion,
  removeItem
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isFocus = theme === 'focus';
  const [locationErrors, setLocationErrors] = useState({ name: '', type: '', description: '' });
  const [plotErrors, setPlotErrors] = useState({ title: '', chapter: '', description: '' });
  const [subplotErrors, setSubplotErrors] = useState({ title: '', description: '' });
  const [relationErrors, setRelationErrors] = useState({ characterId: '', locationId: '' });

  const handleAddLocation = () => {
    const errors = {
      name: newLocation.name.trim() ? '' : 'Nome é obrigatório',
      type: newLocation.type.trim() ? '' : 'Tipo é obrigatório',
      description: newLocation.description.trim() ? '' : 'Descrição é obrigatória'
    };
    setLocationErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    addLocation();
  };

  const handleAddPlotPoint = () => {
    const errors = {
      title: newPlotPoint.title.trim() ? '' : 'Título é obrigatório',
      chapter: newPlotPoint.chapter.trim() ? '' : 'Capítulo é obrigatório',
      description: newPlotPoint.description.trim() ? '' : 'Descrição é obrigatória'
    };
    setPlotErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    addPlotPoint();
  };

  const handleAddSubplot = () => {
    const errors = {
      title: newSubplot.title.trim() ? '' : 'Título é obrigatório',
      description: newSubplot.description.trim() ? '' : 'Descrição é obrigatória'
    };
    setSubplotErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    addSubplot();
  };

  const handleAddRelation = () => {
    const errors = {
      characterId: newRelation.characterId.trim() ? '' : 'Personagem é obrigatório',
      locationId: newRelation.locationId.trim() ? '' : 'Local é obrigatório'
    };
    setRelationErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    addRelation();
  };

  return (
    <div className={`w-80 border-r flex flex-col`} style={{ borderColor: 'var(--border)', background: 'var(--panel)' }}>
      {/* Navigation */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {[
          { id: 'editor', icon: Edit3, label: 'Editor' },
          { id: 'characters', icon: Users, label: 'Personagens' },
          { id: 'locations', icon: MapPin, label: 'Locais' },
          { id: 'plot', icon: BookOpen, label: 'Enredo' },
          { id: 'relations', icon: Link2, label: 'Relações' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex-1 flex items-center justify-center p-3 text-sm font-medium border-b-2 transition-colors ${
              activePanel === tab.id
                ? 'border-purple-500 text-purple-600'
                : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
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
                      isDark
                        ? 'hover:bg-gray-700 text-gray-300'
                        : isFocus
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
                  {history.map((h: any, idx: number) => (
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
              <CharacterForm
                newCharacter={newCharacter}
                setNewCharacter={setNewCharacter}
                addCharacter={addCharacter}
              />
            )}

            <div className="space-y-3">
              {characters.map((char: any) => (
                <div key={char.id} className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{char.name}</h4>
                      {char.role && <p className="text-sm text-purple-600">{char.role}</p>}
                      {char.description && <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{char.description}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(char.id, 'character')}
                      className={`p-1 rounded ${isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
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
              <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="mb-2">
                  <label htmlFor="location-name" className="block text-sm mb-1">Nome do local</label>
                  <input
                    id="location-name"
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => {
                      setNewLocation({ ...newLocation, name: e.target.value });
                      if (locationErrors.name) setLocationErrors({ ...locationErrors, name: '' });
                    }}
                    className={`w-full p-2 border rounded ${locationErrors.name ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {locationErrors.name && <p className="text-red-500 text-sm mt-1">{locationErrors.name}</p>}
                </div>
                <div className="mb-2">
                  <label htmlFor="location-type" className="block text-sm mb-1">Tipo</label>
                  <input
                    id="location-type"
                    type="text"
                    value={newLocation.type}
                    onChange={(e) => {
                      setNewLocation({ ...newLocation, type: e.target.value });
                      if (locationErrors.type) setLocationErrors({ ...locationErrors, type: '' });
                    }}
                    className={`w-full p-2 border rounded ${locationErrors.type ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {locationErrors.type && <p className="text-red-500 text-sm mt-1">{locationErrors.type}</p>}
                </div>
                <div className="mb-2">
                  <label htmlFor="location-description" className="block text-sm mb-1">Descrição do local</label>
                  <textarea
                    id="location-description"
                    value={newLocation.description}
                    onChange={(e) => {
                      setNewLocation({ ...newLocation, description: e.target.value });
                      if (locationErrors.description) setLocationErrors({ ...locationErrors, description: '' });
                    }}
                    className={`w-full p-2 border rounded h-20 ${locationErrors.description ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {locationErrors.description && <p className="text-red-500 text-sm mt-1">{locationErrors.description}</p>}
                </div>
                <button
                  onClick={handleAddLocation}
                  className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                >
                  Adicionar
                </button>
              </div>
            )}

            <div className="space-y-3">
              {locations.map((loc: any) => (
                <div key={loc.id} className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{loc.name}</h4>
                      {loc.type && <p className="text-sm text-purple-600">{loc.type}</p>}
                      {loc.description && <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{loc.description}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(loc.id, 'location')}
                      className={`p-1 rounded ${isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
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
              <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="mb-2">
                  <label htmlFor="plot-title" className="block text-sm mb-1">Título do evento</label>
                  <input
                    id="plot-title"
                    type="text"
                    value={newPlotPoint.title}
                    onChange={(e) => {
                      setNewPlotPoint({ ...newPlotPoint, title: e.target.value });
                      if (plotErrors.title) setPlotErrors({ ...plotErrors, title: '' });
                    }}
                    className={`w-full p-2 border rounded ${plotErrors.title ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {plotErrors.title && <p className="text-red-500 text-sm mt-1">{plotErrors.title}</p>}
                </div>
                <div className="mb-2">
                  <label htmlFor="plot-chapter" className="block text-sm mb-1">Capítulo/Seção</label>
                  <input
                    id="plot-chapter"
                    type="text"
                    value={newPlotPoint.chapter}
                    onChange={(e) => {
                      setNewPlotPoint({ ...newPlotPoint, chapter: e.target.value });
                      if (plotErrors.chapter) setPlotErrors({ ...plotErrors, chapter: '' });
                    }}
                    className={`w-full p-2 border rounded ${plotErrors.chapter ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {plotErrors.chapter && <p className="text-red-500 text-sm mt-1">{plotErrors.chapter}</p>}
                </div>
                <div className="mb-2">
                  <label htmlFor="plot-description" className="block text-sm mb-1">Descrição do evento</label>
                  <textarea
                    id="plot-description"
                    value={newPlotPoint.description}
                    onChange={(e) => {
                      setNewPlotPoint({ ...newPlotPoint, description: e.target.value });
                      if (plotErrors.description) setPlotErrors({ ...plotErrors, description: '' });
                    }}
                    className={`w-full p-2 border rounded h-20 ${plotErrors.description ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {plotErrors.description && <p className="text-red-500 text-sm mt-1">{plotErrors.description}</p>}
                </div>
                <button
                  onClick={handleAddPlotPoint}
                  className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                >
                  Adicionar
                </button>
              </div>
            )}

            <div className="space-y-3">
              {plotPoints.map((plot: any) => (
                <div key={plot.id} className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{plot.title}</h4>
                      {plot.chapter && <p className="text-sm text-purple-600">Cap. {plot.chapter}</p>}
                      {plot.description && <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{plot.description}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(plot.id, 'plot')}
                      className={`p-1 rounded ${isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <h3 className="font-semibold">Subplots</h3>
              <button
                onClick={() => setShowSubplotForm(!showSubplotForm)}
                className="p-1 text-purple-600 hover:bg-purple-100 rounded"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>

            {showSubplotForm && (
              <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="mb-2">
                  <label htmlFor="subplot-title" className="block text-sm mb-1">Título do subplot</label>
                  <input
                    id="subplot-title"
                    type="text"
                    value={newSubplot.title}
                    onChange={(e) => {
                      setNewSubplot({ ...newSubplot, title: e.target.value });
                      if (subplotErrors.title) setSubplotErrors({ ...subplotErrors, title: '' });
                    }}
                    className={`w-full p-2 border rounded ${subplotErrors.title ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {subplotErrors.title && <p className="text-red-500 text-sm mt-1">{subplotErrors.title}</p>}
                </div>
                <div className="mb-2">
                  <label htmlFor="subplot-parent" className="block text-sm mb-1">Plot pai</label>
                  <select
                    id="subplot-parent"
                    value={newSubplot.parent}
                    onChange={(e) => setNewSubplot({ ...newSubplot, parent: e.target.value })}
                    className={`w-full p-2 border rounded ${isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Plot principal</option>
                    {plotPoints.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="subplot-description" className="block text-sm mb-1">Descrição do subplot</label>
                  <textarea
                    id="subplot-description"
                    value={newSubplot.description}
                    onChange={(e) => {
                      setNewSubplot({ ...newSubplot, description: e.target.value });
                      if (subplotErrors.description) setSubplotErrors({ ...subplotErrors, description: '' });
                    }}
                    className={`w-full p-2 border rounded h-20 ${subplotErrors.description ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  />
                  {subplotErrors.description && <p className="text-red-500 text-sm mt-1">{subplotErrors.description}</p>}
                </div>
                <button
                  onClick={handleAddSubplot}
                  className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                >
                  Adicionar
                </button>
              </div>
            )}

            <div className="space-y-3">
              {subplots.map((sp: any) => (
                <div key={sp.id} className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{sp.title}</h4>
                      {sp.parent && <p className="text-sm text-purple-600">Plot: {plotPoints.find((p: any) => p.id === sp.parent)?.title}</p>}
                      {sp.description && <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{sp.description}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(sp.id, 'subplot')}
                      className={`p-1 rounded ${isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePanel === 'relations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Personagem & Local</h3>
              <button
                onClick={() => setShowRelationForm(!showRelationForm)}
                className="p-1 text-purple-600 hover:bg-purple-100 rounded"
              >
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>

            {showRelationForm && (
              <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="mb-2">
                  <label htmlFor="relation-character" className="block text-sm mb-1">Personagem</label>
                  <select
                    id="relation-character"
                    value={newRelation.characterId}
                    onChange={(e) => {
                      setNewRelation({ ...newRelation, characterId: e.target.value });
                      if (relationErrors.characterId) setRelationErrors({ ...relationErrors, characterId: '' });
                    }}
                    className={`w-full p-2 border rounded ${relationErrors.characterId ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Personagem</option>
                    {characters.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {relationErrors.characterId && <p className="text-red-500 text-sm mt-1">{relationErrors.characterId}</p>}
                </div>
                <div className="mb-2">
                  <label htmlFor="relation-location" className="block text-sm mb-1">Local</label>
                  <select
                    id="relation-location"
                    value={newRelation.locationId}
                    onChange={(e) => {
                      setNewRelation({ ...newRelation, locationId: e.target.value });
                      if (relationErrors.locationId) setRelationErrors({ ...relationErrors, locationId: '' });
                    }}
                    className={`w-full p-2 border rounded ${relationErrors.locationId ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Local</option>
                    {locations.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                  {relationErrors.locationId && <p className="text-red-500 text-sm mt-1">{relationErrors.locationId}</p>}
                </div>
                <button
                  onClick={handleAddRelation}
                  className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                >
                  Integrar
                </button>
              </div>
            )}

            <div className="space-y-3">
              {charLocations.map((rel: any) => {
                const char = characters.find((c: any) => c.id === rel.characterId);
                const loc = locations.find((l: any) => l.id === rel.locationId);
                return (
                  <div key={rel.id} className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{char?.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{loc?.name}</p>
                      </div>
                      <button
                        onClick={() => removeItem(rel.id, 'relation')}
                        className={`p-1 rounded ${isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
