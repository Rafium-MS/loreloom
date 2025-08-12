import React from 'react';
import { Era } from '../TimelineWorldHistoryManager';

interface EraCardProps {
  era: Era;
  onEdit?: (era: Era) => void;
  onDelete?: (id: string) => void;
}

const EraCard: React.FC<EraCardProps> = ({ era, onEdit, onDelete }) => {
  return (
    <div className="border p-3 rounded flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {era.color && (
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: era.color }}
          />
        )}
        <div>
          <h4 className="font-semibold">{era.name}</h4>
          <p className="text-sm text-gray-600">
            {era.start} - {era.end}
          </p>
        </div>
      </div>
      <div className="space-x-2 text-sm">
        {onEdit && (
          <button onClick={() => onEdit(era)} className="text-blue-600">
            Editar
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(era.id)} className="text-red-600">
            Excluir
          </button>
        )}
      </div>
    </div>
  );
};

export default EraCard;