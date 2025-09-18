import { useMemo } from 'react';
import { User, MapPin, Users, Shield, TrendingUp } from 'lucide-react';
import type { Character, Location, Economy } from '../universe/types';
import { useAuth } from '../context/AuthContext';

interface QuickStatsPanelProps {
  characters: Character[];
  locations: Location[];
  economies: Economy[];
  onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const QuickStatsPanel = ({ characters, locations, economies, onClose }: QuickStatsPanelProps) => {
  const { user } = useAuth();
  const totalPop = useMemo(
    () => locations.reduce((t, l) => t + (l.population || 0), 0),
    [locations],
  );
  const totalArmy = useMemo(
    () => locations.reduce((t, l) => t + (l.army?.size || 0), 0),
    [locations],
  );
  const totalMonthlyExports = useMemo(
    () => economies.reduce((total, economy) => total + (economy.monthlyExports ?? 0), 0),
    [economies],
  );
  const showMonthlyExportCard = user?.role === 'admin_master';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
    >
      <div className="w-full max-w-xl rounded-lg p-6 bg-panel shadow-token">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Resumo do Universo</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Fechar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg p-4 bg-panel shadow-token">
            <div className="flex items-center">
              <User className="h-6 w-6 text-blue-500" />
              <div className="ml-3">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Personagens
                </p>
                <p className="text-xl font-semibold">{characters.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 bg-panel shadow-token">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-green-500" />
              <div className="ml-3">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Localizações
                </p>
                <p className="text-xl font-semibold">{locations.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 bg-panel shadow-token">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-purple-500" />
              <div className="ml-3">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  População Total
                </p>
                <p className="text-xl font-semibold">
                  {totalPop.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 bg-panel shadow-token">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-500" />
              <div className="ml-3">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Força Militar
                </p>
                <p className="text-xl font-semibold">
                  {totalArmy.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {showMonthlyExportCard ? (
            <div className="rounded-lg p-4 bg-panel shadow-token">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-amber-500" />
                <div className="ml-3">
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Exportação mensal
                  </p>
                  <p className="text-xl font-semibold">
                    {currencyFormatter.format(totalMonthlyExports)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuickStatsPanel;
