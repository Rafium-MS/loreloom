import React, { useState, useEffect } from 'react';
import {
  User, MapPin, Crown, Shield, Coins, Users, Home,
  Sword, Church, UtensilsCrossed, Building, Clock,
  Plus, Edit, Trash2, Eye, ChevronDown, ChevronRight,
  BarChart3, PieChart, TrendingUp, Calendar
} from 'lucide-react';
import {
  getCharacters,
  saveCharacter,
  getLocations,
  saveLocation
} from './dataStore';

const UniverseCreator = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const [characters, setCharacters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    getCharacters().then(setCharacters);
    getLocations().then(setLocations);
  }, []);

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

  // Componente de Formulário de Personagem
  const CharacterForm = ({ character, onSave, onCancel }) => {
    const [formData, setFormData] = useState(character || {
      name: '',
      age: '',
      appearance: '',
      background: '',
      abilities: '',
      motivations: '',
      relationships: '',
      role: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ ...formData, id: character?.id || Date.now() });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {character ? 'Editar Personagem' : 'Novo Personagem'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Idade"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>
            <textarea
              placeholder="Aparência"
              value={formData.appearance}
              onChange={(e) => setFormData({...formData, appearance: e.target.value})}
              className="border rounded px-3 py-2 w-full h-20"
            />
            <textarea
              placeholder="Histórico"
              value={formData.background}
              onChange={(e) => setFormData({...formData, background: e.target.value})}
              className="border rounded px-3 py-2 w-full h-24"
            />
            <textarea
              placeholder="Habilidades"
              value={formData.abilities}
              onChange={(e) => setFormData({...formData, abilities: e.target.value})}
              className="border rounded px-3 py-2 w-full h-20"
            />
            <textarea
              placeholder="Motivações"
              value={formData.motivations}
              onChange={(e) => setFormData({...formData, motivations: e.target.value})}
              className="border rounded px-3 py-2 w-full h-20"
            />
            <textarea
              placeholder="Relacionamentos"
              value={formData.relationships}
              onChange={(e) => setFormData({...formData, relationships: e.target.value})}
              className="border rounded px-3 py-2 w-full h-20"
            />
            <input
              type="text"
              placeholder="Papel Narrativo"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="border rounded px-3 py-2 w-full"
            />
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Componente de Formulário de Localização
  const LocationForm = ({ location, onSave, onCancel }) => {
    const [formData, setFormData] = useState(location || {
      name: '',
      type: 'cidade',
      climate: '',
      population: generatePopulation(),
      culturalComposition: '',
      mainProfessions: [],
      economy: generateEconomy(),
      resources: '',
      army: {
        size: 0,
        weapons: '',
        training: ''
      },
      religions: [],
      commonFoods: [],
      establishments: '',
      strategicPoints: '',
      government: '',
      battles: '',
      events: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ ...formData, id: location?.id || Date.now() });
    };

    const handleArrayChange = (field, value) => {
      const array = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData({...formData, [field]: array});
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {location ? 'Editar Localização' : 'Nova Localização'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3">Informações Básicas</h4>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border rounded px-3 py-2"
                  required
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="border rounded px-3 py-2"
                >
                  <option value="cidade">Cidade</option>
                  <option value="vila">Vila</option>
                  <option value="reino">Reino</option>
                  <option value="fortaleza">Fortaleza</option>
                </select>
                <input
                  type="text"
                  placeholder="Clima"
                  value={formData.climate}
                  onChange={(e) => setFormData({...formData, climate: e.target.value})}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* População */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3">População</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Número de habitantes"
                  value={formData.population}
                  onChange={(e) => setFormData({...formData, population: parseInt(e.target.value)})}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Composição cultural/étnica"
                  value={formData.culturalComposition}
                  onChange={(e) => setFormData({...formData, culturalComposition: e.target.value})}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Economia e Profissões */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3">Economia</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Setor econômico principal"
                  value={formData.economy}
                  onChange={(e) => setFormData({...formData, economy: e.target.value})}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Profissões (separadas por vírgula)"
                  value={formData.mainProfessions.join(', ')}
                  onChange={(e) => handleArrayChange('mainProfessions', e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <textarea
                placeholder="Recursos e fontes de riqueza"
                value={formData.resources}
                onChange={(e) => setFormData({...formData, resources: e.target.value})}
                className="border rounded px-3 py-2 w-full h-20 mt-2"
              />
            </div>

            {/* Exército */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3">Exército Local</h4>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Tamanho do exército"
                  value={formData.army.size}
                  onChange={(e) => setFormData({
                    ...formData,
                    army: {...formData.army, size: parseInt(e.target.value)}
                  })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Armas principais"
                  value={formData.army.weapons}
                  onChange={(e) => setFormData({
                    ...formData,
                    army: {...formData.army, weapons: e.target.value}
                  })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Nível de treinamento"
                  value={formData.army.training}
                  onChange={(e) => setFormData({
                    ...formData,
                    army: {...formData.army, training: e.target.value}
                  })}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Religião e Cultura */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3">Religião e Cultura</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Religiões aceitas (separadas por vírgula)"
                  value={formData.religions.join(', ')}
                  onChange={(e) => handleArrayChange('religions', e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Alimentos comuns (separados por vírgula)"
                  value={formData.commonFoods.join(', ')}
                  onChange={(e) => handleArrayChange('commonFoods', e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Infraestrutura */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3">Infraestrutura</h4>
              <div className="grid grid-cols-2 gap-4">
                <textarea
                  placeholder="Estabelecimentos comerciais"
                  value={formData.establishments}
                  onChange={(e) => setFormData({...formData, establishments: e.target.value})}
                  className="border rounded px-3 py-2 h-24"
                />
                <textarea
                  placeholder="Pontos estratégicos"
                  value={formData.strategicPoints}
                  onChange={(e) => setFormData({...formData, strategicPoints: e.target.value})}
                  className="border rounded px-3 py-2 h-24"
                />
              </div>
            </div>

            {/* História */}
            <div className="pb-4">
              <h4 className="font-semibold mb-3">História</h4>
              <div className="grid grid-cols-2 gap-4">
                <textarea
                  placeholder="Histórico de governos"
                  value={formData.government}
                  onChange={(e) => setFormData({...formData, government: e.target.value})}
                  className="border rounded px-3 py-2 h-24"
                />
                <textarea
                  placeholder="Batalhas importantes"
                  value={formData.battles}
                  onChange={(e) => setFormData({...formData, battles: e.target.value})}
                  className="border rounded px-3 py-2 h-24"
                />
              </div>
              <textarea
                placeholder="Eventos importantes"
                value={formData.events}
                onChange={(e) => setFormData({...formData, events: e.target.value})}
                className="border rounded px-3 py-2 w-full h-20 mt-2"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Componente de Visualização de Personagem
  const CharacterView = ({ character }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
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
              setCharacters(chars => chars.filter(c => c.id !== character.id));
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
    </div>
  );

  // Componente de Visualização de Localização
  const LocationView = ({ location }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
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
              setLocations(locs => locs.filter(l => l.id !== location.id));
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
            >
              {expandedSections[`professions-${location.id}`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Profissões Principais
            </button>
            {expandedSections[`professions-${location.id}`] && (
              <div className="ml-6 mt-1 text-sm text-gray-600">
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
            >
              {expandedSections[`strategic-${location.id}`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Pontos Estratégicos
            </button>
            {expandedSections[`strategic-${location.id}`] && (
              <div className="ml-6 mt-1 text-sm text-gray-600">
                {location.strategicPoints}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Handlers
  const handleSaveCharacter = async (characterData) => {
    await saveCharacter(characterData);
    setCharacters(await getCharacters());
    setSelectedCharacter(null);
    setShowCharacterForm(false);
  };

  const handleSaveLocation = async (locationData) => {
    await saveLocation(locationData);
    setLocations(await getLocations());
    setSelectedLocation(null);
    setShowLocationForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Criador de Universos</h1>
          <p className="text-gray-600">Crie personagens detalhados e construa cidades, reinos e vilas</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('characters')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'characters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="inline mr-2" size={16} />
              Personagens
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'locations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin className="inline mr-2" size={16} />
              Localizações
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="inline mr-2" size={16} />
              Estatísticas
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'characters' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Personagens</h2>
              <button
                onClick={() => setShowCharacterForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Novo Personagem
              </button>
            </div>

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
          </div>
        )}

        {activeTab === 'locations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Localizações</h2>
              <button
                onClick={() => setShowLocationForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Plus size={16} />
                Nova Localização
              </button>
            </div>

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
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
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
          </div>
        )}
      </div>

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
            setCharacters(prev => [...prev, randomCharacter]);
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
            setLocations(prev => [...prev, randomLocation]);
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
        />
      )}
    </div>
  );
};

export default UniverseCreator;