// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { getTotalPopulation, getTotalArmySize } from '../utils/stats';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatsPanel = ({ characters, locations, onClose }) => {
  const [roleFilter, setRoleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const roleOptions = useMemo(() => Array.from(new Set(characters.map(c => c.role))), [characters]);
  const typeOptions = useMemo(() => Array.from(new Set(locations.map(l => l.type))), [locations]);

  const filteredCharacters = useMemo(
    () => (roleFilter === 'all' ? characters : characters.filter(c => c.role === roleFilter)),
    [characters, roleFilter]
  );
  const filteredLocations = useMemo(
    () => (typeFilter === 'all' ? locations : locations.filter(l => l.type === typeFilter)),
    [locations, typeFilter]
  );

  const roleLabels = Array.from(new Set(filteredCharacters.map(c => c.role)));
  const roleCounts = roleLabels.map(role => filteredCharacters.filter(c => c.role === role).length);

  const typeLabels = Array.from(new Set(filteredLocations.map(l => l.type)));
  const typeCounts = typeLabels.map(type => filteredLocations.filter(l => l.type === type).length);

  const populationLabels = filteredLocations.map(l => l.name);
  const populationData = filteredLocations.map(l => l.population || 0);

  const armyLabels = filteredLocations.map(l => l.name);
  const armyData = filteredLocations.map(l => l.army?.size || 0);

  const totalPopulation = getTotalPopulation(filteredLocations);
  const totalArmy = getTotalArmySize(filteredLocations);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Estatísticas do Universo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
        </div>

        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm mb-1">Tipo de personagem</label>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">Todos</option>
              {roleOptions.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Região</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">Todas</option>
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Personagens por Papel</h3>
            <Pie data={{ labels: roleLabels, datasets: [{ data: roleCounts, backgroundColor: roleLabels.map((_, i) => `hsl(${(i * 60) % 360},70%,60%)`) }] }} />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Localizações por Tipo</h3>
            <Pie data={{ labels: typeLabels, datasets: [{ data: typeCounts, backgroundColor: typeLabels.map((_, i) => `hsl(${(i * 60) % 360},70%,60%)`) }] }} />
          </div>
          <div>
            <h3 className="font-semibold mb-2">População por Local</h3>
            <Bar data={{ labels: populationLabels, datasets: [{ label: 'População', data: populationData, backgroundColor: '#36A2EB' }] }} />
            <p className="text-sm mt-2">População total: {totalPopulation.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Força Militar por Local</h3>
            <Bar data={{ labels: armyLabels, datasets: [{ label: 'Exército', data: armyData, backgroundColor: '#FF6384' }] }} />
            <p className="text-sm mt-2">Força militar total: {totalArmy.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
