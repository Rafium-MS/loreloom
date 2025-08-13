import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  TimelineWorldHistoryManager,
  Era,
  TimelineEvent,
} from '../TimelineWorldHistoryManager';
import EraCard from '../components/EraCard';
import EventCard from '../components/EventCard';
import FiltersBar from '../components/FiltersBar';
import {
  getEras,
  getEvents,
  addEra,
  updateEra,
  deleteEra,
  addEvent,
  updateEvent,
  deleteEvent,
} from '../services/timelineRepository';

import Skeleton from '../../../app/core/ui/Skeleton';
import EmptyState from '../../../app/core/ui/EmptyState';
import { useToast } from '../../../app/core/ui/Toast';

const TimelinePage: React.FC = () => {
  const [eras, setEras] = useState<Era[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    setEras(getEras());
    setEvents(getEvents());
    setLoading(false);
  }, []);

  const [eraForm, setEraForm] = useState({
    id: '',
    name: '',
    start: '',
    end: '',
    color: '#e0e0e0',
  });

  const [eventForm, setEventForm] = useState({
    id: '',
    name: '',
    date: '',
    category: '',
    eraId: '',
  });

  const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean))) as string[];

  const handleEraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const era: Era = {
      id: eraForm.id || uuidv4(),
      name: eraForm.name,
      start: Number(eraForm.start),
      end: Number(eraForm.end),
      color: eraForm.color,
    };
    try {
      if (eraForm.id) {
        updateEra(era);
        setEras(prev => prev.map(er => (er.id === era.id ? era : er)));
      } else {
        addEra(era);
        setEras(prev => [...prev, era]);
      }
      addToast({ type: 'success', message: 'Era salva.' });
      setEraForm({ id: '', name: '', start: '', end: '', color: '#e0e0e0' });
    } catch {
      addToast({ type: 'error', message: 'Erro ao salvar era.' });
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ev: TimelineEvent = {
      id: eventForm.id || uuidv4(),
      name: eventForm.name,
      date: Number(eventForm.date),
      eraId: eventForm.eraId || undefined,
      category: eventForm.category || undefined,
    };
    try {
      if (eventForm.id) {
        updateEvent(ev);
        setEvents(prev => prev.map(eve => (eve.id === ev.id ? ev : eve)));
      } else {
        addEvent(ev);
        setEvents(prev => [...prev, ev]);
      }
      addToast({ type: 'success', message: 'Evento salvo.' });
      setEventForm({ id: '', name: '', date: '', category: '', eraId: '' });
    } catch {
      addToast({ type: 'error', message: 'Erro ao salvar evento.' });
    }
  };

  const handleEraEdit = (era: Era) => {
    setEraForm({
      id: era.id,
      name: era.name,
      start: String(era.start),
      end: String(era.end),
      color: era.color || '#e0e0e0',
    });
  };

  const handleEventEdit = (ev: TimelineEvent) => {
    setEventForm({
      id: ev.id,
      name: ev.name,
      date: String(ev.date),
      category: ev.category || '',
      eraId: ev.eraId || '',
    });
  };

  const handleEraDelete = (id: string) => {
    try {
      deleteEra(id);
      setEras(prev => prev.filter(e => e.id !== id));
      addToast({ type: 'success', message: 'Era removida.' });
    } catch {
      addToast({ type: 'error', message: 'Erro ao remover era.' });
    }
  };

  const handleEventDelete = (id: string) => {
    try {
      deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      addToast({ type: 'success', message: 'Evento removido.' });
    } catch {
      addToast({ type: 'error', message: 'Erro ao remover evento.' });
    }
  };

  const filteredEvents =
    selectedCategories.length === 0
      ? events
      : events.filter(e => e.category && selectedCategories.includes(e.category));

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Linha do Tempo</h2>

      <form onSubmit={handleEraSubmit} className="space-x-2">
        <input
          id="era-name"
          type="text"
          placeholder="Nome da era"
          value={eraForm.name}
          onChange={e => setEraForm({ ...eraForm, name: e.target.value })}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="number"
          placeholder="Início"
          value={eraForm.start}
          onChange={e => setEraForm({ ...eraForm, start: e.target.value })}
          className="border rounded px-2 py-1 w-24"
        />
        <input
          type="number"
          placeholder="Fim"
          value={eraForm.end}
          onChange={e => setEraForm({ ...eraForm, end: e.target.value })}
          className="border rounded px-2 py-1 w-24"
        />
        <input
          type="color"
          value={eraForm.color}
          onChange={e => setEraForm({ ...eraForm, color: e.target.value })}
          className="w-10 h-8 p-0 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          {eraForm.id ? 'Atualizar' : 'Adicionar'} Era
        </button>
      </form>

      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : eras.length === 0 ? (
          <EmptyState
            message="Nenhuma era cadastrada."
            actionLabel="Adicionar Era"
            onAction={() => document.getElementById('era-name')?.focus()}
          />
        ) : (
          eras.map(era => (
            <EraCard key={era.id} era={era} onEdit={handleEraEdit} onDelete={handleEraDelete} />
          ))
        )}
      </div>

      <form onSubmit={handleEventSubmit} className="space-x-2">
        <input
          id="event-name"
          type="text"
          placeholder="Nome do evento"
          value={eventForm.name}
          onChange={e => setEventForm({ ...eventForm, name: e.target.value })}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="number"
          placeholder="Ano"
          value={eventForm.date}
          onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
          className="border rounded px-2 py-1 w-24"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={eventForm.category}
          onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
          className="border rounded px-2 py-1"
        />
        <select
          value={eventForm.eraId}
          onChange={e => setEventForm({ ...eventForm, eraId: e.target.value })}
          className="border rounded px-2 py-1"
        >
          <option value="">Sem Era</option>
          {eras.map(era => (
            <option key={era.id} value={era.id}>
              {era.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
          {eventForm.id ? 'Atualizar' : 'Adicionar'} Evento
        </button>
      </form>

      <FiltersBar
        categories={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />

      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            message="Nenhum evento encontrado."
            actionLabel="Adicionar Evento"
            onAction={() => document.getElementById('event-name')?.focus()}
          />
        ) : (
          filteredEvents.map(ev => (
            <EventCard key={ev.id} event={ev} onEdit={handleEventEdit} onDelete={handleEventDelete} />
          ))
        )}
      </div>

      <TimelineWorldHistoryManager eras={eras} events={filteredEvents} />
    </div>
  );
};

export default TimelinePage;
