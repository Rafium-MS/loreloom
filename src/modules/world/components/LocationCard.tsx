import React from 'react';
import { Location } from './LocationForm';

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (id: number) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded p-4 shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{location.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{location.type}</p>
        </div>
        <div className="space-x-2 text-sm">
          <button onClick={() => onEdit(location)} className="text-blue-500 hover:underline">Editar</button>
          <button onClick={() => onDelete(location.id)} className="text-red-500 hover:underline">Excluir</button>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div><span className="font-semibold">Clima:</span> {location.climate || '-'}</div>
        <div><span className="font-semibold">População:</span> {location.population.toLocaleString()}</div>
        <div><span className="font-semibold">Economia:</span> {location.economy || '-'}</div>
        <div><span className="font-semibold">Religiões:</span> {location.religions.length}</div>
      </div>
    </div>
  );
};

export default LocationCard;