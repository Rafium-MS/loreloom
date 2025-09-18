import { useState } from 'react';
import {
  User,
  MapPin,
  Users,
  Coins,
  Church,
  Clock,
  Plus,
  BarChart3,
  BookOpen,
  Shield,
} from 'lucide-react';
import {
  CharacterForm,
  LocationForm,
  EconomyForm,
  ReligionForm,
  TimelineForm,
  LanguageForm,
  Character,
  Location,
  Economy,
  Religion,
  TimelineEvent,
  Language,
  generatePopulation,
  generateEconomy,
  generateDemography,
  CharacterView,
  LocationView,
  EconomyView,
  ReligionView,
  TimelineView,
  LanguageView,
  createCharacterSaver,
  createLocationSaver,
  createEconomySaver,
  createReligionSaver,
  createTimelineSaver,
  createLanguageSaver,
  createSectionToggler,
} from './universe';
import { useCharacters } from './hooks/useCharacters';
import { useLocations } from './hooks/useLocations';
import { useEconomies } from './hooks/useEconomies';
import { useReligions } from './hooks/useReligions';
import { useTimelines } from './hooks/useTimelines';
import { useLanguages } from './hooks/useLanguages';
import { useTheme } from './ui/ThemeProvider';
import EntityRelationsGraph from './components/EntityRelationsGraph';
import QuickStatsPanel from './components/QuickStatsPanel';
import QuickTools from './components/QuickTools';
import './tokens.css';

const UniverseCreator = () => {
  const [activeTab, setActiveTab] = useState(
    'characters' as
      | 'characters'
      | 'locations'
      | 'economies'
      | 'religions'
      | 'timelines'
      | 'languages',
  );

  // ===== Characters
  const {
    characters,
    saveCharacter,
    removeCharacter,
    linkCharacterToLocation,
    linkCharacterToReligion,
    // os seguintes podem não existir no hook; colocamos fallbacks abaixo
    unlinkCharacterFromLocation: _unlinkCharacterFromLocation,
    unlinkCharacterFromReligion: _unlinkCharacterFromReligion,
  } = useCharacters();

  // fallbacks (no-ops) para evitar crashes se o hook não expuser as funções
  const unlinkCharacterFromLocation = _unlinkCharacterFromLocation ?? (async () => {});
  const unlinkCharacterFromReligion = _unlinkCharacterFromReligion ?? (async () => {});

  // ===== Locations
  const {
    locations,
    saveLocation,
    removeLocation,
    linkLocationToCharacter,
    unlinkLocationFromCharacter: _unlinkLocationFromCharacter,
  } = useLocations();
  const unlinkLocationFromCharacter = _unlinkLocationFromCharacter ?? (async () => {});

  // ===== Economies
  const { economies, saveEconomy, removeEconomy } = useEconomies();

  // ===== Religions
  const {
    religions,
    saveReligion,
    removeReligion,
    linkReligionToCharacter,
    unlinkReligionFromCharacter: _unlinkReligionFromCharacter2,
  } = useReligions();
  const unlinkReligionFromCharacter = _unlinkReligionFromCharacter2 ?? (async () => {});

  // ===== Timelines & Languages
  const { timelines, saveTimeline, removeTimeline } = useTimelines();
  const { languages, saveLanguage, removeLanguage } = useLanguages();

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // seleção e modais
  const [selectedCharacter, setSelectedCharacter] = useState(null as Character | null);
  const [selectedLocation, setSelectedLocation] = useState(null as Location | null);
  const [selectedEconomy, setSelectedEconomy] = useState(null as Economy | null);
  const [selectedReligion, setSelectedReligion] = useState(null as Religion | null);
  const [selectedTimeline, setSelectedTimeline] = useState(null as TimelineEvent | null);
  const [selectedLanguage, setSelectedLanguage] = useState(null as Language | null);

  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showEconomyForm, setShowEconomyForm] = useState(false);
  const [showReligionForm, setShowReligionForm] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [showLanguageForm, setShowLanguageForm] = useState(false);
const [showStatsPanel, setShowStatsPanel] = useState(false);
const [expandedSections, setExpandedSections] = useState(
  {} as Record<string, boolean>,
);
const toggleSection = createSectionToggler(setExpandedSections);

  const handleSaveCharacter = createCharacterSaver({
    selectedCharacter,
    saveCharacter,
    linkCharacterToLocation,
    unlinkCharacterFromLocation,
    linkCharacterToReligion,
    unlinkCharacterFromReligion,
    setSelectedCharacter,
    setShowCharacterForm,
  });

  const handleSaveLocation = createLocationSaver({
    selectedLocation,
    saveLocation,
    linkLocationToCharacter,
    unlinkLocationFromCharacter,
    setSelectedLocation,
    setShowLocationForm,
  });

  const handleSaveEconomy = createEconomySaver({
    saveEconomy,
    setSelectedEconomy,
    setShowEconomyForm,
  });

  const handleSaveReligion = createReligionSaver({
    selectedReligion,
    saveReligion,
    linkReligionToCharacter,
    unlinkReligionFromCharacter,
    setSelectedReligion,
    setShowReligionForm,
  });

  const handleSaveTimeline = createTimelineSaver({
    saveTimeline,
    setSelectedTimeline,
    setShowTimelineForm,
  });

  const handleSaveLanguage = createLanguageSaver({
    saveLanguage,
    setSelectedLanguage,
    setShowLanguageForm,
  });

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header className="border-b border-border shadow-token" style={{ background: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Criador de Universos</h1>
          <p style={{ color: 'var(--muted)' }}>Crie personagens detalhados e construa cidades, reinos e vilas</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border" aria-label="Seções do universo" style={{ background: 'var(--panel)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8" role="tablist">
            <button
              id="characters-tab"
              onClick={() => setActiveTab('characters')}
              className={`py-4 px-2 border-b-2 font-medium text-sm border-transparent ${activeTab === 'characters' ? 'border-blue-500 text-blue-600' : ''}`}
              style={activeTab === 'characters' ? undefined : { color: 'var(--muted)' }}
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
              className={`py-4 px-2 border-b-2 font-medium text-sm border-transparent ${activeTab === 'locations' ? 'border-blue-500 text-blue-600' : ''}`}
              style={activeTab === 'locations' ? undefined : { color: 'var(--muted)' }}
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
              className={`py-4 px-2 border-b-2 font-medium text-sm border-transparent ${activeTab === 'economies' ? 'border-blue-500 text-blue-600' : ''}`}
              style={activeTab === 'economies' ? undefined : { color: 'var(--muted)' }}
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
              className={`py-4 px-2 border-b-2 font-medium text-sm border-transparent ${activeTab === 'religions' ? 'border-blue-500 text-blue-600' : ''}`}
              style={activeTab === 'religions' ? undefined : { color: 'var(--muted)' }}
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
              className={`py-4 px-2 border-b-2 font-medium text-sm border-transparent ${activeTab === 'timelines' ? 'border-blue-500 text-blue-600' : ''}`}
              style={activeTab === 'timelines' ? undefined : { color: 'var(--muted)' }}
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
              className={`py-4 px-2 border-b-2 font-medium text-sm border-transparent ${activeTab === 'languages' ? 'border-blue-500 text-blue-600' : ''}`}
              style={activeTab === 'languages' ? undefined : { color: 'var(--muted)' }}
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
              className={`py-4 px-2 border-b-2 font-medium text-sm border-transparent ${activeTab === 'analytics' ? 'border-blue-500 text-blue-600' : ''}`}
              style={activeTab === 'analytics' ? undefined : { color: 'var(--muted)' }}
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
                <User size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>Nenhum personagem criado</h3>
                <p className="mb-4" style={{ color: 'var(--muted)' }}>Comece criando seu primeiro personagem</p>
                <button
                  onClick={() => setShowCharacterForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Criar Personagem
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character: Character) => (
                  <CharacterView
                    key={character.id}
                    character={character}
                    onEdit={() => setSelectedCharacter(character)}
                    onRemove={() => removeCharacter(character.id)}
                  />
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
                <MapPin size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>Nenhuma localização criada</h3>
                <p className="mb-4" style={{ color: 'var(--muted)' }}>Comece construindo sua primeira cidade ou reino</p>
                <button
                  onClick={() => setShowLocationForm(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Criar Localização
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {locations.map((location: Location) => (
                  <LocationView
                    key={location.id}
                    location={location}
                    onEdit={() => setSelectedLocation(location)}
                    onRemove={() => removeLocation(location.id)}
                    expandedSections={expandedSections}
                    toggleSection={toggleSection}
                  />
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
                <Coins size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>Nenhuma economia cadastrada</h3>
                <p className="mb-4" style={{ color: 'var(--muted)' }}>Adicione mercados e sistemas econômicos</p>
                <button
                  onClick={() => setShowEconomyForm(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Criar Economia
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {economies.map((econ: Economy) => (
                  <EconomyView
                    key={econ.id}
                    economy={econ}
                    onEdit={() => setSelectedEconomy(econ)}
                    onRemove={() => removeEconomy(econ.id)}
                  />
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
                <Church size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>Nenhuma religião cadastrada</h3>
                <p className="mb-4" style={{ color: 'var(--muted)' }}>Crie crenças e facções para seu mundo</p>
                <button
                  onClick={() => setShowReligionForm(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                >
                  Criar Religião
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {religions.map((rel: Religion) => (
                  <ReligionView
                    key={rel.id}
                    religion={rel}
                    onEdit={() => setSelectedReligion(rel)}
                    onRemove={() => removeReligion(rel.id)}
                  />
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
                <Clock size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>Nenhum evento registrado</h3>
                <p className="mb-4" style={{ color: 'var(--muted)' }}>Construa a história do seu universo</p>
                <button
                  onClick={() => setShowTimelineForm(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Criar Evento
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timelines.map((ev: TimelineEvent) => (
                  <TimelineView
                    key={ev.id}
                    event={ev}
                    onEdit={() => setSelectedTimeline(ev)}
                    onRemove={() => removeTimeline(ev.id)}
                  />
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
                <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>Nenhuma língua criada</h3>
                <p className="mb-4" style={{ color: 'var(--muted)' }}>Crie vocabulários e regras gramaticais</p>
                <button
                  onClick={() => setShowLanguageForm(true)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                >
                  Criar Língua
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languages.map((lang: Language) => (
                  <LanguageView
                    key={lang.id}
                    language={lang}
                    onEdit={() => setSelectedLanguage(lang)}
                    onRemove={() => removeLanguage(lang.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'analytics' && (
          <section id="analytics-panel" role="tabpanel" aria-labelledby="analytics-tab">
            <h2 className="text-xl font-semibold mb-6">Estatísticas do Universo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="rounded-lg p-6 bg-panel shadow-token">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Personagens</p>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{characters.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg p-6 bg-panel shadow-token">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Localizações</p>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{locations.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg p-6 bg-panel shadow-token">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>População Total</p>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                      {locations
                        .reduce(
                          (total: number, loc: Location) => total + (loc.population || 0),
                          0,
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg p-6 bg-panel shadow-token">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Força Militar</p>
                    <p className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                      {locations
                        .reduce(
                          (total: number, loc: Location) => total + (loc.army?.size || 0),
                          0,
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {locations.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg p-6 bg-panel shadow-token">
                  <h3 className="text-lg font-medium mb-4">Distribuição por Tipo de Localização</h3>
                  <div className="space-y-3">
                    {['cidade', 'vila', 'reino', 'fortaleza'].map(type => {
                      const count = locations.filter((loc: Location) => loc.type === type).length;
                      const percentage =
                        locations.length > 0 ? ((count / locations.length) * 100).toFixed(1) : 0;
                      return (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize text-sm font-medium">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-24 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-sm w-12" style={{ color: 'var(--muted)' }}>{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-lg p-6 bg-panel shadow-token">
                  <h3 className="text-lg font-medium mb-4">Maiores Populações</h3>
                  <div className="space-y-3">
                    {locations
                      .slice() // evitar sort in-place
                      .sort(
                        (a: Location, b: Location) =>
                          (b.population || 0) - (a.population || 0),
                      )
                      .slice(0, 5)
                      .map((location: Location) => (
                        <div
                          key={location.id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <span className="font-medium">{location.name}</span>
                            <span className="text-sm ml-2 capitalize" style={{ color: 'var(--muted)' }}>({location.type})</span>
                          </div>
                          <span className="text-sm font-medium">
                            {(location.population || 0).toLocaleString()}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <div className="rounded-lg p-6 bg-panel shadow-token">
                  <h3 className="text-lg font-medium mb-4">Setores Econômicos</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      (locations as Location[]).reduce(
                        (acc: Record<string, number>, loc) => {
                          if (loc.economy)
                            acc[loc.economy] = (acc[loc.economy] || 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([sector, count]) => (
                      <div key={sector} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{sector}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-24 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${locations.length > 0 ? (count / locations.length) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm w-12" style={{ color: 'var(--muted)' }}>{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg p-6 bg-panel shadow-token">
                  <h3 className="text-lg font-medium mb-4">Diversidade Religiosa</h3>
                  <div className="space-y-3">
                    {(() => {
                      const counts = (locations as Location[]).reduce(
                        (acc: Record<string, number>, loc) => {
                          (loc.religions || []).forEach((r: string) => {
                            acc[r] = (acc[r] || 0) + 1;
                          });
                          return acc;
                        },
                        {} as Record<string, number>,
                      );
                      const entries = Object.entries(counts)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 6);
                      const max = Math.max(0, ...entries.map(([, c]) => c));
                      return entries.map(([religion, count]) => (
                        <div key={religion} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{religion}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-24 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${max ? (count / max) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-sm w-12" style={{ color: 'var(--muted)' }}>{count}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            {locations.length === 0 && characters.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>Nenhum dado para análise</h3>
                <p style={{ color: 'var(--muted)' }}>Crie personagens e localizações para ver estatísticas detalhadas</p>
              </div>
            )}
          </section>
        )}
      </section>

      <QuickTools
        characters={characters}
        locations={locations}
        saveCharacter={saveCharacter}
        saveLocation={saveLocation}
        setShowStatsPanel={setShowStatsPanel}
      />

      {(selectedCharacter || selectedLocation) && (
        <EntityRelationsGraph
          characters={characters}
          locations={locations}
          religions={religions}
          character={selectedCharacter}
          location={selectedLocation}
          selectedCharacter={selectedCharacter}
          selectedLocation={selectedLocation}
        />
      )}

      {/* Modais */}
      {(showCharacterForm || selectedCharacter) && (
        <CharacterForm
          character={selectedCharacter}
          onSave={(data) => handleSaveCharacter(data as Character)}
          onCancel={() => {
            setSelectedCharacter(null);
            setShowCharacterForm(false);
          }}
        />
      )}

      {(showLocationForm || selectedLocation) && (
      <LocationForm
        location={selectedLocation}
        onSave={(data) => handleSaveLocation(data as Location)}
        onCancel={() => {
          setSelectedLocation(null);
          setShowLocationForm(false);
        }}
        generatePopulation={generatePopulation}
        generateEconomy={generateEconomy}
        generateDemography={generateDemography}
      />
    )}

      {(showEconomyForm || selectedEconomy) && (
        <EconomyForm
          economy={selectedEconomy}
          onSave={(data) => handleSaveEconomy(data as Economy)}
          onCancel={() => {
            setSelectedEconomy(null);
            setShowEconomyForm(false);
          }}
        />
      )}

      {(showReligionForm || selectedReligion) && (
        <ReligionForm
          religion={selectedReligion}
          onSave={(data) => handleSaveReligion(data as Religion)}
          onCancel={() => {
            setSelectedReligion(null);
            setShowReligionForm(false);
          }}
        />
      )}

      {(showTimelineForm || selectedTimeline) && (
        <TimelineForm
          event={selectedTimeline}
          onSave={(data) => handleSaveTimeline(data as TimelineEvent)}
          onCancel={() => {
            setSelectedTimeline(null);
            setShowTimelineForm(false);
          }}
        />
      )}

      {(showLanguageForm || selectedLanguage) && (
        <LanguageForm
          language={selectedLanguage}
          onSave={(data) => handleSaveLanguage(data as Language)}
          onCancel={() => {
            setSelectedLanguage(null);
            setShowLanguageForm(false);
          }}
        />
      )}

      {showStatsPanel && (
        <QuickStatsPanel
          characters={characters}
          locations={locations}
          economies={economies}
          onClose={() => setShowStatsPanel(false)}
        />
      )}
    </main>
  );
};

export default UniverseCreator;
