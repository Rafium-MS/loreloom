import React from 'react';
import { useParams } from 'react-router-dom';

const LocationDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{name}</h1>
    </div>
  );
};

export default LocationDetailPage;
