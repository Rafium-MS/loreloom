import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Calendar, MapPin, Users, Sword, Lightbulb, Crown, ChevronDown, ChevronRight, Filter, Search, Eye, EyeOff } from 'lucide-react';

const TimelineManager = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Fundação do Reino de Eldoria",
      date: "Ano 1 da Era Imperial",
      type: "political",
      description: "O primeiro rei Aldric I unifica as tribos e funda o reino.",
      characters: ["Rei Aldric I"],
      locations: ["Eldoria Central"],
      consequences: ["Estabelecimento da monarquia", "Unificação das tribos"],
      era: "Era Imperial"
    },
    {
      id: 2,
      title: "Grande Guerra dos Dragões",
      date: "Anos 156-162 da Era Imperial",
      type: "war",
      description: "Conflito épico entre humanos e dragões antigos pelo controle das montanhas sagradas.",
      characters: ["Lorde Gareth, o Matador de Dragões", "Draconius, o Dragão Ancião"],
      locations: ["Montanhas Sagradas", "Vale dos Ossos"],
      consequences: ["Quase extinção dos dragões", "Surgimento da Ordem dos Caçadores"],
      era: "Era Imperial"
    },
    {
      id: 3,
      title: "Descoberta da Magia Arcana",
      date: "Ano 203 da Era Imperial",
      type: "discovery",
      description: "A maga Lyralei descobre como canalizar energia mágica através de cristais.",
      characters: ["Maga Lyralei"],
      locations: ["Torre de Cristal"],
      consequences: ["Revolução mágica", "Fundação da Academia de Magia"],
      era: "Era Imperial"
    }
  ]);

  const [eras, setEras] = useState([
    { id: 1, name: "Era Primordial", startYear: "Antes do Tempo", endYear: "Ano 0", color: "#8B5A3C" },
    { id: 2, name: "Era Imperial", startYear: "Ano 1", endYear: "Ano 500", color: "#4A90E2" },
    { id: 3, name: "Era das Trevas", startYear: "Ano 501", endYear: "Ano 800", color: "#2C2C2C" },
    { id: 4, name: "Era do Renascimento", startYear: "Ano 801", endYear: "Presente", color: "#F5A623" }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('event'); // 'event' or 'era'
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [showConnections, setShowConnections] = useState(true);

  const eventTypes = {
    political: { icon: Crown, color: '#9B59B6', label: 'Político' },
    war: { icon: Sword, color: '#E74C3C', label: 'Guerra' },
    discovery: { icon: Lightbulb, color: '#F39C12', label: 'Descoberta' },
    birth: { icon: Users, color: '#2ECC71', label: 'Nascimento' },
    death: { icon: Users, color: '#34495E', label: 'Morte' },
    cultural: { icon: Calendar, color: '#3498DB', label: 'Cultural' },
    natural: { icon: MapPin, color: '#1ABC9C', label: 'Natural' }
  };

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'political',
    description: '',
    characters: [],
    locations: [],
    consequences: [],
    era: eras[0]?.name || ''
  });

  const [newEra, setNewEra] = useState({
    name: '',
    startYear: '',
    endYear: '',
    color: '#4A90E2'
  });

  const resetNewEvent = () => {
    setNewEvent({
      title: '',
      date: '',
      type: 'political',
      description: '',
      characters: [],
      locations: [],
      consequences: [],
      era: eras[0]?.name || ''
    });
  };

  const resetNewEra = () => {
    setNewEra({
      name: '',
      startYear: '',
      endYear: '',
      color: '#4A90E2'
    });
  };

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.date) {
      if (selectedEvent) {
        setEvents(events.map(e => e.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : e));
      } else {
        setEvents([...events, { ...newEvent, id: Date.now() }]);
      }
      resetNewEvent();
      setSelectedEvent(null);
      setShowModal(false);
    }
  };

  const handleSaveEra = () => {
    if (newEra.name && newEra.startYear && newEra.endYear) {
      if (selectedEvent) {
        setEras(eras.map(e => e.id === selectedEvent.id ? { ...newEra, id: selectedEvent.id } : e));
      } else {
        setEras([...eras, { ...newEra, id: Date.now() }]);
      }
      resetNewEra();
      setSelectedEvent(null);
      setShowModal(false);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({ ...event });
    setModalType('event');
    setShowModal(true);
  };

  const handleEditEra = (era) => {
    setSelectedEvent(era);
    setNewEra({ ...era });
    setModalType('era');
    setShowModal(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleDeleteEra = (id) => {
    setEras(eras.filter(e => e.id !== id));
  };

  const addArrayItem = (field, value, type = 'event') => {
    if (value.trim()) {
      if (type === 'event') {
        setNewEvent(prev => ({
          ...prev,
          [field]: [...prev[field], value.trim()]
        }));
      }
    }
  };

  const removeArrayItem = (field, index, type = 'event') => {
    if (type === 'event') {
      setNewEvent(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const toggleEventExpansion = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const filteredEvents = events.filter(event => {
    const matchesEra = selectedEra === 'all' || event.era === selectedEra;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.characters.some(char => char.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         event.locations.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesEra && matchesType && matchesSearch;
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    // Sorting logic - you might want to implement proper date parsing here
    return a.date.localeCompare(b.date);
  });

  const getEventConnections = (event) => {
    return events.filter(e => 
      e.id !== event.id && (
        e.characters.some(char => event.characters.includes(char)) ||
        e.locations.some(loc => event.locations.includes(loc)) ||
        e.consequences.some(cons => event.consequences.includes(cons))
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Timeline & World History Manager</h1>
        <p className="text-gray-600 mb-4">Gerencie a cronologia e história do seu universo</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => {
              resetNewEvent();
              setSelectedEvent(null);
              setModalType('event');
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Novo Evento
          </button>
          
          <button
            onClick={() => {
              resetNewEra();
              setSelectedEvent(null);
              setModalType('era');
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={16} />
            Nova Era
          </button>

          <button
            onClick={() => setShowConnections(!showConnections)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showConnections ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {showConnections ? <Eye size={16} /> : <EyeOff size={16} />}
            Conexões
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas as Eras</option>
            {eras.map(era => (
              <option key={era.id} value={era.name}>{era.name}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos os Tipos</option>
            {Object.entries(eventTypes).map(([key, type]) => (
              <option key={key} value={key}>{type.label}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {filteredEvents.length} evento(s)
          </div>
        </div>

        {/* Eras */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Eras Históricas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eras.map(era => (
              <div
                key={era.id}
                className="p-4 rounded-lg border-l-4 bg-white shadow-sm"
                style={{ borderLeftColor: era.color }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{era.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditEra(era)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEra(era.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{era.startYear} - {era.endYear}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline de Eventos */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Linha do Tempo</h2>
        
        <div className="space-y-4">
          {sortedEvents.map((event, index) => {
            const EventIcon = eventTypes[event.type]?.icon || Calendar;
            const eventColor = eventTypes[event.type]?.color || '#6B7280';
            const isExpanded = expandedEvents.has(event.id);
            const connections = getEventConnections(event);
            
            return (
              <div key={event.id} className="relative">
                {/* Linha conectora */}
                {index < sortedEvents.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300 z-0"></div>
                )}
                
                <div className="flex gap-4 relative z-10">
                  {/* Ícone do evento */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: eventColor }}
                  >
                    <EventIcon size={20} />
                  </div>
                  
                  {/* Conteúdo do evento */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full text-white"
                                style={{ backgroundColor: eventColor }}>
                            {eventTypes[event.type]?.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.date} • {event.era}</p>
                      </div>
                      
                      <div className="flex gap-1 ml-4">
                        <button
                          onClick={() => toggleEventExpansion(event.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{event.description}</p>
                    
                    {isExpanded && (
                      <div className="space-y-3 border-t pt-3">
                        {event.characters.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users size={16} className="text-blue-600" />
                              <span className="font-medium text-gray-700">Personagens:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {event.characters.map((char, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {event.locations.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin size={16} className="text-green-600" />
                              <span className="font-medium text-gray-700">Locais:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {event.locations.map((loc, i) => (
                                <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  {loc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {event.consequences.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb size={16} className="text-yellow-600" />
                              <span className="font-medium text-gray-700">Consequências:</span>
                            </div>
                            <div className="space-y-1">
                              {event.consequences.map((cons, i) => (
                                <span key={i} className="block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  {cons}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {showConnections && connections.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 border-2 border-purple-600 rounded"></div>
                              <span className="font-medium text-gray-700">Eventos Conectados:</span>
                            </div>
                            <div className="space-y-1">
                              {connections.map(conn => (
                                <div key={conn.id} className="px-2 py-1 bg-purple-50 border border-purple-200 rounded text-xs">
                                  <span className="font-medium">{conn.title}</span> ({conn.date})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {modalType === 'event' 
                  ? (selectedEvent ? 'Editar Evento' : 'Novo Evento')
                  : (selectedEvent ? 'Editar Era' : 'Nova Era')
                }
              </h2>
            </div>
            
            <div className="p-6">
              {modalType === 'event' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título do evento"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Data (ex: Ano 156 da Era Imperial)"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(eventTypes).map(([key, type]) => (
                        <option key={key} value={key}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={newEvent.era}
                    onChange={(e) => setNewEvent({ ...newEvent, era: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {eras.map(era => (
                      <option key={era.id} value={era.name}>{era.name}</option>
                    ))}
                  </select>
                  
                  <textarea
                    placeholder="Descrição do evento"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* Arrays editáveis */}
                  {['characters', 'locations', 'consequences'].map(field => (
                    <div key={field} className="space-y-2">
                      <label className="block font-medium text-gray-700 capitalize">
                        {field === 'characters' ? 'Personagens' : 
                         field === 'locations' ? 'Locais' : 'Consequências'}:
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newEvent[field].map((item, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {item}
                            <button
                              onClick={() => removeArrayItem(field, index)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Adicionar ${field === 'characters' ? 'personagem' : 
                                                  field === 'locations' ? 'local' : 'consequência'}`}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem(field, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.parentElement.querySelector('input');
                            addArrayItem(field, input.value);
                            input.value = '';
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome da era"
                    value={newEra.name}
                    onChange={(e) => setNewEra({ ...newEra, name: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Ano inicial"
                      value={newEra.startYear}
                      onChange={(e) => setNewEra({ ...newEra, startYear: e.target.value })}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    
                    <input
                      type="text"
                      placeholder="Ano final"
                      value={newEra.endYear}
                      onChange={(e) => setNewEra({ ...newEra, endYear: e.target.value })}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Cor da era:</label>
                    <input
                      type="color"
                      value={newEra.color}
                      onChange={(e) => setNewEra({ ...newEra, color: e.target.value })}
                      className="w-16 h-10 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={modalType === 'event' ? handleSaveEvent : handleSaveEra}
                className={`px-6 py-2 text-white rounded-lg hover:opacity-90 ${
                  modalType === 'event' ? 'bg-blue-600' : 'bg-purple-600'
                }`}
              >
                {selectedEvent ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineManager;