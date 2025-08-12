import React from 'react';
import { Location } from './LocationForm';

interface AnalyticsPanelProps {
  locations: Location[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ locations }) => {
  if (locations.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8">
        Nenhuma localização cadastrada.
      </div>
    );
  }

  const typeCounts = ['cidade', 'vila', 'reino', 'fortaleza'].map(type => ({
    type,
    count: locations.filter(l => l.type === type).length
  }));

  const topPopulations = [...locations]
    .sort((a, b) => b.population - a.population)
    .slice(0, 5);

  const economyCounts = locations.reduce<Record<string, number>>((acc, loc) => {
    if (loc.economy) {
      acc[loc.economy] = (acc[loc.economy] || 0) + 1;
    }
    return acc;
  }, {});

  const religionCounts = locations.reduce<Record<string, number>>((acc, loc) => {
    loc.religions.forEach(r => {
      acc[r] = (acc[r] || 0) + 1;
    });
    return acc;
  }, {});

  const economyEntries = Object.entries(economyCounts);
  const religionEntries = Object.entries(religionCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Estatísticas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium mb-2">Contagem por Tipo</h3>
          {typeCounts.map(({ type, count }) => (
            <div key={type} className="flex justify-between text-sm">
              <span className="capitalize">{type}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium mb-2">Maiores Populações</h3>
          {topPopulations.map(loc => (
            <div key={loc.id} className="flex justify-between text-sm">
              <span>{loc.name}</span>
              <span>{loc.population.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium mb-2">Setores Econômicos</h3>
          {economyEntries.map(([sector, count]) => (
            <div key={sector} className="flex justify-between text-sm">
              <span>{sector}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium mb-2">Diversidade Religiosa</h3>
          {religionEntries.map(([religion, count]) => (
            <div key={religion} className="flex justify-between text-sm">
              <span>{religion}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;