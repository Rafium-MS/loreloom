// @ts-nocheck
import React, { useState } from 'react';
import {
  User, MapPin, Crown, Shield, Coins, Users, Home,
  Sword, Church, UtensilsCrossed, Building, Clock,
  Plus, Edit, Trash2, Eye, ChevronDown, ChevronRight,
  BarChart3, PieChart, TrendingUp, Calendar, BookOpen
} from 'lucide-react';
import { CharacterForm, LocationForm, EconomyForm, ReligionForm, TimelineForm, LanguageForm } from './universe';
import { useCharacters } from './hooks/useCharacters';
import { useLocations } from './hooks/useLocations';
import { useEconomies } from './hooks/useEconomies';
import { useReligions } from './hooks/useReligions';
import { useTimelines } from './hooks/useTimelines';
import { useLanguages } from './hooks/useLanguages';
import './tokens.css';

const UniverseCreator = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const { characters, saveCharacter, removeCharacter } = useCharacters();
  const { locations, saveLocation, removeLocation } = useLocations();
  const { economies, saveEconomy, removeEconomy } = useEconomies();
  const { religions, saveReligion, removeReligion } = useReligions();
  const { timelines, saveTimeline, removeTimeline } = useTimelines();
  const { languages, saveLanguage, removeLanguage } = useLanguages();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEconomy, setSelectedEconomy] = useState(null);
  const [selectedReligion, setSelectedReligion] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showEconomyForm, setShowEconomyForm] = useState(false);
  const [showReligionForm, setShowReligionForm] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  

  // Dados de exemplo para demonstração
  const professionsList = [
    'Mercador', 'Ferreiro', 'Agricultor', 'Soldado', 'Pescador', 'Carpinteiro',
    'Alquimista', 'Escriba', 'Tavarneiro', 'Guarda', 'Artesão', 'Curandeiro'
  ];

  const religionsList = [
    'Culto do Sol', 'Adoradores da Lua', 'Seguidores da Terra',
    'Místicos do Vento', 'Devotos da Água', 'Guardiões da Floresta'
  ];

  const foodsList = [
    'Pão de centeio', 'Ensopado de carne', 'Peixe grelhado', 'Frutas silvestres',
    'Queijo de cabra', 'Cerveja de cevada', 'Vinho tinto', 'Mel silvestre'
  ];

  // Funções auxiliares
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generatePopulation = () => {
    return Math.floor(Math.random() * 50000) + 1000;
  };

  const generateEconomy = () => {
    const resources = ['Agricultura', 'Mineração', 'Comércio', 'Pesca', 'Artesanato'];
    return resources[Math.floor(Math.random() * resources.length)];
  };

  const generateNameFromSyllables = (syllablesString) => {
    const syllables = syllablesString.split(',').map(s => s.trim()).filter(Boolean);
    if (syllables.length === 0) return '';
    const count = Math.floor(Math.random() * 2) + 2;
    let name = '';
    for (let i = 0; i < count; i++) {
      name += syllables[Math.floor(Math.random() * syllables.length)];
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Componente de Visualização de Personagem
  const CharacterView = ({ character }) => (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{character.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCharacter(character)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              removeCharacter(character.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        {character.age && <p><span className="font-semibold">Idade:</span> {character.age}</p>}
        {character.appearance && <p><span className="font-semibold">Aparência:</span> {character.appearance}</p>}
        {character.role && <p><span className="font-semibold">Papel:</span> {character.role}</p>}
        {character.abilities && <p><span className="font-semibold">Habilidades:</span> {character.abilities}</p>}
        {character.motivations && <p><span className="font-semibold">Motivações:</span> {character.motivations}</p>}
      </div>
    </section>
  );

  // Componente de Visualização de Localização
  const LocationView = ({ location }) => (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{location.name}</h3>
          <p className="text-gray-600 capitalize">{location.type}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedLocation(location)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              removeLocation(location.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            <span className="font-semibold">População:</span> 
            <span>{location.population?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-green-500" />
            <span className="font-semibold">Economia:</span> 
            <span>{location.economy}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-red-500" />
            <span className="font-semibold">Exército:</span> 
            <span>{location.army?.size || 0} soldados</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Church size={16} className="text-purple-500" />
            <span className="font-semibold">Religiões:</span> 
            <span>{location.religions?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} className="text-orange-500" />
            <span className="font-semibold">Pratos típicos:</span> 
            <span>{location.commonFoods?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <span className="font-semibold">Clima:</span> 
            <span>{location.climate || 'Não definido'}</span>
          </div>
        </div>
      </div>

      {/* Seções expansíveis */}
      <div className="mt-4 space-y-2">
        {location.mainProfessions?.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection(`professions-${location.id}`)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
              aria-expanded={expandedSections[`professions-${location.id}`] || false}
              aria-controls={`professions-${location.id}-content`}
            >
              {expandedSections[`professions-${location.id}`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Profissões Principais
            </button>
            {expandedSections[`professions-${location.id}`] && (
              <div id={`professions-${location.id}-content`} className="ml-6 mt-1 text-sm text-gray-600">
                {location.mainProfessions.join(', ')}
              </div>
            )}
          </div>
        )}

        {location.strategicPoints && (
          <div>
            <button
              onClick={() => toggleSection(`strategic-${location.id}`)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
              aria-expanded={expandedSections[`strategic-${location.id}`] || false}
              aria-controls={`strategic-${location.id}-content`}
            >
              {expandedSections[`strategic-${location.id}`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Pontos Estratégicos
            </button>
            {expandedSections[`strategic-${location.id}`] && (
              <div id={`strategic-${location.id}-content`} className="ml-6 mt-1 text-sm text-gray-600">
                {location.strategicPoints}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );

  const EconomyView = ({ economy }) => (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{economy.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => setSelectedEconomy(economy)} className="text-blue-500 hover:text-blue-700">
            <Edit size={16} />
          </button>
          <button onClick={() => removeEconomy(economy.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {economy.currency && <p><span className="font-semibold">Moeda:</span> {economy.currency}</p>}
        {economy.markets && <p><span className="font-semibold">Mercados:</span> {economy.markets}</p>}
        {economy.mainExports && <p><span className="font-semibold">Exportações:</span> {economy.mainExports}</p>}
      </div>
    </section>
  );

  const ReligionView = ({ religion }) => (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{religion.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => setSelectedReligion(religion)} className="text-blue-500 hover:text-blue-700">
            <Edit size={16} />
          </button>
          <button onClick={() => removeReligion(religion.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {religion.doctrine && <p><span className="font-semibold">Doutrina:</span> {religion.doctrine}</p>}
        {religion.factions && <p><span className="font-semibold">Facções:</span> {religion.factions}</p>}
      </div>
    </section>
  );

  const TimelineView = ({ event }) => (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => setSelectedTimeline(event)} className="text-blue-500 hover:text-blue-700">
            <Edit size={16} />
          </button>
          <button onClick={() => removeTimeline(event.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {event.date && <p><span className="font-semibold">Data:</span> {event.date}</p>}
        {event.description && <p><span className="font-semibold">Descrição:</span> {event.description}</p>}
        {event.relations && <p><span className="font-semibold">Relacionamentos:</span> {event.relations}</p>}
      </div>
    </section>
  );

  const LanguageView = ({ language }) => (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{language.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => setSelectedLanguage(language)} className="text-blue-500 hover:text-blue-700">
            <Edit size={16} />
          </button>
          <button onClick={() => removeLanguage(language.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {language.grammar && <p><span className="font-semibold">Gramática:</span> {language.grammar}</p>}
      </div>
      {language.syllables && (
        <button
          onClick={() => alert(generateNameFromSyllables(language.syllables))}
          className="mt-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
        >
          Gerar Nome
        </button>
      )}
    </section>
  );

  // Handlers
  const handleSaveCharacter = async (characterData) => {
    await saveCharacter(characterData);
    setSelectedCharacter(null);
    setShowCharacterForm(false);
  };

  const handleSaveLocation = async (locationData) => {
    await saveLocation(locationData);
    setSelectedLocation(null);
    setShowLocationForm(false);
  };

  const handleSaveEconomy = async (economyData) => {
    await saveEconomy(economyData);
    setSelectedEconomy(null);
    setShowEconomyForm(false);
  };

  const handleSaveReligion = async (religionData) => {
    await saveReligion(religionData);
    setSelectedReligion(null);
    setShowReligionForm(false);
  };

  const handleSaveTimeline = async (timelineData) => {
    await saveTimeline(timelineData);
    setSelectedTimeline(null);
    setShowTimelineForm(false);
  };

  const handleSaveLanguage = async (languageData) => {
    await saveLanguage(languageData);
    setSelectedLanguage(null);
    setShowLanguageForm(false);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Criador de Universos</h1>
          <p className="text-gray-600">Crie personagens detalhados e construa cidades, reinos e vilas</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b" aria-label="Seções do universo">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8" role="tablist">
            <button
              id="characters-tab"
              onClick={() => setActiveTab('characters')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'characters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-controls="characters-panel"
              aria-selected={activeTab === 'characters'}
              role="tab"
            >
              <User className="inline mr-2" size={16} />
              Personagens
            </button>
            <button
              id="locations-tab"
              onClick={() => setActiveTab('locations')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'locations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-controls="locations-panel"
              aria-selected={activeTab === 'locations'}
              role="tab"
            >
              <MapPin className="inline mr-2" size={16} />
              Localizações
            </button>
            <button
              id="economies-tab"
              onClick={() => setActiveTab('economies')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'economies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-controls="economies-panel"
              aria-selected={activeTab === 'economies'}
              role="tab"
            >
              <Coins className="inline mr-2" size={16} />
              Economia
            </button>
            <button
              id="religions-tab"
              onClick={() => setActiveTab('religions')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'religions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-controls="religions-panel"
              aria-selected={activeTab === 'religions'}
              role="tab"
            >
              <Church className="inline mr-2" size={16} />
              Religiões
            </button>
            <button
              id="timelines-tab"
              onClick={() => setActiveTab('timelines')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'timelines'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-controls="timelines-panel"
              aria-selected={activeTab === 'timelines'}
              role="tab"
            >
              <Clock className="inline mr-2" size={16} />
              Linha do Tempo
            </button>
            <button
              id="languages-tab"
              onClick={() => setActiveTab('languages')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'languages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-controls="languages-panel"
              aria-selected={activeTab === 'languages'}
              role="tab"
            >
              <BookOpen className="inline mr-2" size={16} />
              Línguas
            </button>
            <button
              id="analytics-tab"
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-controls="analytics-panel"
              aria-selected={activeTab === 'analytics'}
              role="tab"
            >
              <BarChart3 className="inline mr-2" size={16} />
              Estatísticas
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'characters' && (
          <section id="characters-panel" role="tabpanel" aria-labelledby="characters-tab">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Personagens</h2>
              <button
                onClick={() => setShowCharacterForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Novo Personagem
              </button>
            </header>

            {characters.length === 0 ? (
              <div className="text-center py-12">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum personagem criado</h3>
                <p className="text-gray-600 mb-4">Comece criando seu primeiro personagem</p>
                <button
                  onClick={() => setShowCharacterForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Criar Personagem
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map(character => (
                  <CharacterView key={character.id} character={character} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'locations' && (
          <section id="locations-panel" role="tabpanel" aria-labelledby="locations-tab">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Localizações</h2>
              <button
                onClick={() => setShowLocationForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Nova Localização
              </button>
            </header>

            {locations.length === 0 ? (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma localização criada</h3>
                <p className="text-gray-600 mb-4">Comece construindo sua primeira cidade ou reino</p>
                <button
                  onClick={() => setShowLocationForm(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Criar Localização
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {locations.map(location => (
                  <LocationView key={location.id} location={location} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'economies' && (
          <section id="economies-panel" role="tabpanel" aria-labelledby="economies-tab">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Economia e Mercados</h2>
              <button
                onClick={() => setShowEconomyForm(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Nova Economia
              </button>
            </header>
            {economies.length === 0 ? (
              <div className="text-center py-12">
                <Coins size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma economia cadastrada</h3>
                <p className="text-gray-600 mb-4">Adicione mercados e sistemas econômicos</p>
                <button
                  onClick={() => setShowEconomyForm(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Criar Economia
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {economies.map(econ => (
                  <EconomyView key={econ.id} economy={econ} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'religions' && (
          <section id="religions-panel" role="tabpanel" aria-labelledby="religions-tab">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Religiões e Facções</h2>
              <button
                onClick={() => setShowReligionForm(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Nova Religião
              </button>
            </header>
            {religions.length === 0 ? (
              <div className="text-center py-12">
                <Church size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma religião cadastrada</h3>
                <p className="text-gray-600 mb-4">Crie crenças e facções para seu mundo</p>
                <button
                  onClick={() => setShowReligionForm(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                >
                  Criar Religião
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {religions.map(rel => (
                  <ReligionView key={rel.id} religion={rel} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'timelines' && (
          <section id="timelines-panel" role="tabpanel" aria-labelledby="timelines-tab">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Linha do Tempo</h2>
              <button
                onClick={() => setShowTimelineForm(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Novo Evento
              </button>
            </header>
            {timelines.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento registrado</h3>
                <p className="text-gray-600 mb-4">Construa a história do seu universo</p>
                <button
                  onClick={() => setShowTimelineForm(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Criar Evento
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timelines.map(ev => (
                  <TimelineView key={ev.id} event={ev} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'languages' && (
          <section id="languages-panel" role="tabpanel" aria-labelledby="languages-tab">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Línguas</h2>
              <button
                onClick={() => setShowLanguageForm(true)}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Nova Língua
              </button>
            </header>
            {languages.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma língua criada</h3>
                <p className="text-gray-600 mb-4">Crie vocabulários e regras gramaticais</p>
                <button
                  onClick={() => setShowLanguageForm(true)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                >
                  Criar Língua
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languages.map(lang => (
                  <LanguageView key={lang.id} language={lang} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'analytics' && (
          <section id="analytics-panel" role="tabpanel" aria-labelledby="analytics-tab">
            <h2 className="text-xl font-semibold mb-6">Estatísticas do Universo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Personagens</p>
                    <p className="text-2xl font-semibold text-gray-900">{characters.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Localizações</p>
                    <p className="text-2xl font-semibold text-gray-900">{locations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">População Total</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {locations.reduce((total, loc) => total + (loc.population || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Força Militar</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {locations.reduce((total, loc) => total + (loc.army?.size || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos e Análises */}
            {locations.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4">Distribuição por Tipo de Localização</h3>
                  <div className="space-y-3">
                    {['cidade', 'vila', 'reino', 'fortaleza'].map(type => {
                      const count = locations.filter(loc => loc.type === type).length;
                      const percentage = locations.length > 0 ? (count / locations.length * 100).toFixed(1) : 0;
                      return (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize text-sm font-medium">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4">Maiores Populações</h3>
                  <div className="space-y-3">
                    {locations
                      .sort((a, b) => (b.population || 0) - (a.population || 0))
                      .slice(0, 5)
                      .map(location => (
                        <div key={location.id} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{location.name}</span>
                            <span className="text-sm text-gray-500 ml-2 capitalize">({location.type})</span>
                          </div>
                          <span className="text-sm font-medium">
                            {(location.population || 0).toLocaleString()}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4">Setores Econômicos</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      locations.reduce((acc, loc) => {
                        if (loc.economy) {
                          acc[loc.economy] = (acc[loc.economy] || 0) + 1;
                        }
                        return acc;
                      }, {})
                    ).map(([sector, count]) => (
                      <div key={sector} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{sector}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{width: `${locations.length > 0 ? (count / locations.length * 100) : 0}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4">Diversidade Religiosa</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      locations.reduce((acc, loc) => {
                        (loc.religions || []).forEach(religion => {
                          acc[religion] = (acc[religion] || 0) + 1;
                        });
                        return acc;
                      }, {})
                    )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([religion, count]) => (
                      <div key={religion} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{religion}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{width: `${Math.max(...Object.values(locations.reduce((acc, loc) => {
                                (loc.religions || []).forEach(r => {
                                  acc[r] = (acc[r] || 0) + 1;
                                });
                                return acc;
                              }, {}))) > 0 ? (count / Math.max(...Object.values(locations.reduce((acc, loc) => {
                                (loc.religions || []).forEach(r => {
                                  acc[r] = (acc[r] || 0) + 1;
                                });
                                return acc;
                              }, {}))) * 100) : 0}%`}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {locations.length === 0 && characters.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado para análise</h3>
                <p className="text-gray-600">Crie personagens e localizações para ver estatísticas detalhadas</p>
              </div>
            )}
          </section>
        )}
      </section>

      {/* Ferramentas Rápidas - Sidebar flutuante */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-2">
        <button
          onClick={() => {
            const randomCharacter = {
              id: Date.now(),
              name: `Personagem ${characters.length + 1}`,
              age: Math.floor(Math.random() * 50) + 18,
              appearance: 'Aparência gerada automaticamente',
              background: 'História gerada automaticamente',
              abilities: 'Habilidades variadas',
              motivations: 'Motivações complexas',
              relationships: 'Relacionamentos diversos',
              role: 'Papel importante na narrativa'
            };
            saveCharacter(randomCharacter);
          }}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          title="Gerar Personagem Aleatório"
        >
          <User size={20} />
        </button>

        <button
          onClick={() => {
            const types = ['cidade', 'vila', 'reino', 'fortaleza'];
            const climates = ['Temperado', 'Tropical', 'Árido', 'Frio', 'Montanhoso'];
            const randomLocation = {
              id: Date.now(),
              name: `Local ${locations.length + 1}`,
              type: types[Math.floor(Math.random() * types.length)],
              climate: climates[Math.floor(Math.random() * climates.length)],
              population: generatePopulation(),
              culturalComposition: 'Diversa',
              mainProfessions: professionsList.slice(0, Math.floor(Math.random() * 5) + 3),
              economy: generateEconomy(),
              resources: 'Recursos variados disponíveis',
              army: {
                size: Math.floor(Math.random() * 5000) + 100,
                weapons: 'Espadas e arcos',
                training: 'Treinamento regular'
              },
              religions: religionsList.slice(0, Math.floor(Math.random() * 3) + 1),
              commonFoods: foodsList.slice(0, Math.floor(Math.random() * 4) + 2),
              establishments: 'Tavernas, mercados e oficinas',
              strategicPoints: 'Muralhas e torres de vigia',
              government: 'História de liderança estável',
              battles: 'Algumas escaramuças menores',
              events: 'Festivais anuais e celebrações'
            };
            saveLocation(randomLocation);
          }}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          title="Gerar Localização Aleatória"
        >
          <MapPin size={20} />
        </button>

        <button
          onClick={() => {
            const totalPop = locations.reduce((total, loc) => total + (loc.population || 0), 0);
            const totalArmy = locations.reduce((total, loc) => total + (loc.army?.size || 0), 0);
            alert(`Resumo do Universo:\n\n• Personagens: ${characters.length}\n• Localizações: ${locations.length}\n• População Total: ${totalPop.toLocaleString()}\n• Força Militar: ${totalArmy.toLocaleString()}`);
          }}
          className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
          title="Resumo Rápido"
        >
          <BarChart3 size={20} />
        </button>
      </div>

      {/* Modais */}
      {(showCharacterForm || selectedCharacter) && (
        <CharacterForm
          character={selectedCharacter}
          onSave={handleSaveCharacter}
          onCancel={() => {
            setSelectedCharacter(null);
            setShowCharacterForm(false);
          }}
        />
      )}

      {(showLocationForm || selectedLocation) && (
        <LocationForm
          location={selectedLocation}
          onSave={handleSaveLocation}
          onCancel={() => {
            setSelectedLocation(null);
            setShowLocationForm(false);
          }}
          generatePopulation={generatePopulation}
          generateEconomy={generateEconomy}
        />
      )}

      {(showEconomyForm || selectedEconomy) && (
        <EconomyForm
          economy={selectedEconomy}
          onSave={handleSaveEconomy}
          onCancel={() => {
            setSelectedEconomy(null);
            setShowEconomyForm(false);
          }}
        />
      )}

      {(showReligionForm || selectedReligion) && (
        <ReligionForm
          religion={selectedReligion}
          onSave={handleSaveReligion}
          onCancel={() => {
            setSelectedReligion(null);
            setShowReligionForm(false);
          }}
        />
      )}

      {(showTimelineForm || selectedTimeline) && (
        <TimelineForm
          event={selectedTimeline}
          onSave={handleSaveTimeline}
          onCancel={() => {
            setSelectedTimeline(null);
            setShowTimelineForm(false);
          }}
        />
      )}

      {(showLanguageForm || selectedLanguage) && (
        <LanguageForm
          language={selectedLanguage}
          onSave={handleSaveLanguage}
          onCancel={() => {
            setSelectedLanguage(null);
            setShowLanguageForm(false);
          }}
        />
      )}
    </main>
  );
};

export default UniverseCreator;
