import { User, MapPin, BarChart3 } from 'lucide-react';
import type { Character, Location } from '../universe';
import {
  generateRandomCharacter,
  generateRandomLocation,
} from '../universe';

interface QuickToolsProps {
  characters: Character[];
  locations: Location[];
  saveCharacter: (c: Character) => Promise<void> | void;
  saveLocation: (l: Location) => Promise<void> | void;
  setShowStatsPanel: (v: boolean) => void;
}

const QuickTools = ({
  characters,
  locations,
  saveCharacter,
  saveLocation,
  setShowStatsPanel,
}: QuickToolsProps) => (
  <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-2">
    <button
      onClick={() => saveCharacter(generateRandomCharacter(characters.length))}
      className="bg-blue-500 text-white p-3 rounded-full shadow-token hover:bg-blue-600 transition-colors"
      title="Gerar Personagem Aleatório"
    >
      <User size={20} />
    </button>

    <button
      onClick={() => saveLocation(generateRandomLocation(locations.length))}
      className="bg-green-500 text-white p-3 rounded-full shadow-token hover:bg-green-600 transition-colors"
      title="Gerar Localização Aleatória"
    >
      <MapPin size={20} />
    </button>

    <button
      onClick={() => setShowStatsPanel(true)}
      className="bg-purple-500 text-white p-3 rounded-full shadow-token hover:bg-purple-600 transition-colors"
      title="Resumo Rápido"
    >
      <BarChart3 size={20} />
    </button>
  </div>
);

export default QuickTools;
