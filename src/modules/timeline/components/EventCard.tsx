import React from 'react';
import { TimelineEvent } from '../TimelineWorldHistoryManager';

interface EventCardProps {
  event: TimelineEvent;
  onEdit?: (event: TimelineEvent) => void;
  onDelete?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <div className="border p-3 rounded flex justify-between items-center">
      <div>
        <h4 className="font-semibold">{event.name}</h4>
        <p className="text-sm text-gray-600">
          {event.date}
          {event.category && ` - ${event.category}`}
        </p>
      </div>
      <div className="space-x-2 text-sm">
        {onEdit && (
          <button onClick={() => onEdit(event)} className="text-blue-600">
            Editar
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(event.id)} className="text-red-600">
            Excluir
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;