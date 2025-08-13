import React from 'react';
import { RelationshipVisualizer, RelationshipData } from '../RelationshipVisualizer';

const sampleData: RelationshipData = {
  nodes: [
    { id: 'a', name: 'Alice', group: '1' },
    { id: 'b', name: 'Bob', group: '1' },
    { id: 'c', name: 'Charlie', group: '2' },
  ],
  links: [
    { source: 'a', target: 'b', value: 1 },
    { source: 'a', target: 'c', value: 1 },
  ],
};

const RelationshipVisualizerPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Visualizador de Relações</h2>
      <RelationshipVisualizer data={sampleData} width={800} height={600} />
    </div>
  );
};

export default RelationshipVisualizerPage;
