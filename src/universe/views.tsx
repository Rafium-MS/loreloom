import {
  Edit,
  Trash2,
  Users,
  Coins,
  Shield,
  Church,
  UtensilsCrossed,
  MapPin,
  PieChart,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type {
  Character,
  Location,
  Economy,
  Religion,
  TimelineEvent,
  Language,
} from './types';
import { generateNameFromSyllables } from './utils';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const CharacterView = ({
  character,
  onEdit,
  onRemove,
}: {
  character: Character;
  onEdit: () => void;
  onRemove: () => void;
}) => (
  <section className="rounded-lg p-6 bg-panel shadow-token">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{character.name}</h3>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          title="Editar personagem"
          aria-label="Editar personagem"
          className="text-blue-500 hover:text-blue-700"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onRemove}
          title="Remover personagem"
          aria-label="Remover personagem"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>

    <div className="space-y-3 text-sm">
      {character.age && (
        <p>
          <span className="font-semibold">Idade:</span> {character.age}
        </p>
      )}
      {character.appearance && (
        <p>
          <span className="font-semibold">Aparência:</span> {character.appearance}
        </p>
      )}
      {character.role && (
        <p>
          <span className="font-semibold">Papel:</span> {character.role}
        </p>
      )}
      {character.abilities && (
        <p>
          <span className="font-semibold">Habilidades:</span> {character.abilities}
        </p>
      )}
      {character.motivations && (
        <p>
          <span className="font-semibold">Motivações:</span> {character.motivations}
        </p>
      )}
    </div>
  </section>
);

export const LocationView = ({
  location,
  onEdit,
  onRemove,
  expandedSections,
  toggleSection,
}: {
  location: Location;
  onEdit: () => void;
  onRemove: () => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}) => (
  <section className="rounded-lg p-6 bg-panel shadow-token">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold">{location.name}</h3>
        <p style={{ color: 'var(--muted)' }} className="capitalize">
          {location.type}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          title="Editar local"
          aria-label="Editar local"
          className="text-blue-500 hover:text-blue-700"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onRemove}
          title="Remover local"
          aria-label="Remover local"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-500" />
          <span className="font-semibold">População:</span>
          <span>{location.population?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <PieChart size={16} className="text-indigo-500" />
          <span className="font-semibold">Demografia:</span>
          <span>
            Crianças: {location.demographics?.children ?? 0}, Adultos:{' '}
            {location.demographics?.adults ?? 0}, Idosos:{' '}
            {location.demographics?.elders ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Coins size={16} className="text-green-500" />
          <span className="font-semibold">Economia:</span>
          <span>{location.economy}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-red-500" />
          <span className="font-semibold">Exército:</span>
          <span>{location.army?.size || 0} soldados</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Church size={16} className="text-purple-500" />
          <span className="font-semibold">Religiões:</span>
          <span>{location.religions?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={16} className="text-orange-500" />
          <span className="font-semibold">Pratos típicos:</span>
          <span>{location.commonFoods?.length || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} style={{ color: 'var(--muted)' }} />
          <span className="font-semibold">Clima:</span>
          <span>{location.climate || 'Não definido'}</span>
        </div>
      </div>
    </div>

    <div className="mt-4 space-y-2">
      {(location.mainProfessions?.length ?? 0) > 0 && (
        <div>
          <button
            onClick={() => toggleSection(`professions-${location.id}`)}
            className="flex items-center gap-2 text-sm font-semibold"
            aria-expanded={expandedSections[`professions-${location.id}`] || false}
            aria-controls={`professions-${location.id}-content`}
          >
            {expandedSections[`professions-${location.id}`] ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Profissões Principais
          </button>
          {expandedSections[`professions-${location.id}`] && (
            <div
              id={`professions-${location.id}-content`}
              className="ml-6 mt-1 text-sm"
              style={{ color: 'var(--muted)' }}
            >
              {location.mainProfessions?.join(', ')}
            </div>
          )}
        </div>
      )}

      {location.strategicPoints && (
        <div>
          <button
            onClick={() => toggleSection(`strategic-${location.id}`)}
            className="flex items-center gap-2 text-sm font-semibold"
            aria-expanded={expandedSections[`strategic-${location.id}`] || false}
            aria-controls={`strategic-${location.id}-content`}
          >
            {expandedSections[`strategic-${location.id}`] ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Pontos Estratégicos
          </button>
          {expandedSections[`strategic-${location.id}`] && (
            <div
              id={`strategic-${location.id}-content`}
              className="ml-6 mt-1 text-sm"
              style={{ color: 'var(--muted)' }}
            >
              {location.strategicPoints}
            </div>
          )}
        </div>
      )}
    </div>
  </section>
);

export const EconomyView = ({
  economy,
  onEdit,
  onRemove,
}: {
  economy: Economy;
  onEdit: () => void;
  onRemove: () => void;
}) => (
  <section className="rounded-lg p-6 bg-panel shadow-token">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{economy.name}</h3>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          title="Editar economia"
          aria-label="Editar economia"
          className="text-blue-500 hover:text-blue-700"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onRemove}
          title="Remover economia"
          aria-label="Remover economia"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      {economy.currency && (
        <p>
          <span className="font-semibold">Moeda:</span> {economy.currency}
        </p>
      )}
      {economy.markets && (
        <p>
          <span className="font-semibold">Mercados:</span> {economy.markets}
        </p>
      )}
      {economy.mainExports && (
        <p>
          <span className="font-semibold">Exportações:</span> {economy.mainExports}
        </p>
      )}
      {economy.monthlyExports !== undefined && economy.monthlyExports !== null && (
        <p>
          <span className="font-semibold">Exportação mensal:</span>{' '}
          {currencyFormatter.format(economy.monthlyExports)}
        </p>
      )}
    </div>
  </section>
);

export const ReligionView = ({
  religion,
  onEdit,
  onRemove,
}: {
  religion: Religion;
  onEdit: () => void;
  onRemove: () => void;
}) => (
  <section className="rounded-lg p-6 bg-panel shadow-token">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{religion.name}</h3>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          title="Editar religião"
          aria-label="Editar religião"
          className="text-blue-500 hover:text-blue-700"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onRemove}
          title="Remover religião"
          aria-label="Remover religião"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      {religion.doctrine && (
        <p>
          <span className="font-semibold">Doutrina:</span> {religion.doctrine}
        </p>
      )}
      {religion.factions && (
        <p>
          <span className="font-semibold">Facções:</span> {religion.factions}
        </p>
      )}
    </div>
  </section>
);

export const TimelineView = ({
  event,
  onEdit,
  onRemove,
}: {
  event: TimelineEvent;
  onEdit: () => void;
  onRemove: () => void;
}) => (
  <section className="rounded-lg p-6 bg-panel shadow-token">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{event.title}</h3>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          title="Editar evento"
          aria-label="Editar evento"
          className="text-blue-500 hover:text-blue-700"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onRemove}
          title="Remover evento"
          aria-label="Remover evento"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      {event.date && (
        <p>
          <span className="font-semibold">Data:</span> {event.date}
        </p>
      )}
      {event.description && (
        <p>
          <span className="font-semibold">Descrição:</span> {event.description}
        </p>
      )}
      {event.relations && (
        <p>
          <span className="font-semibold">Relacionamentos:</span> {event.relations}
        </p>
      )}
    </div>
  </section>
);

export const LanguageView = ({
  language,
  onEdit,
  onRemove,
}: {
  language: Language;
  onEdit: () => void;
  onRemove: () => void;
}) => (
  <section className="rounded-lg p-6 bg-panel shadow-token">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{language.name}</h3>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          title="Editar língua"
          aria-label="Editar língua"
          className="text-blue-500 hover:text-blue-700"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onRemove}
          title="Remover língua"
          aria-label="Remover língua"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      {language.grammar && (
        <p>
          <span className="font-semibold">Gramática:</span> {language.grammar}
        </p>
      )}
    </div>
    {language.syllables && (
      <button
        onClick={() =>
          alert(generateNameFromSyllables(language.syllables ?? ''))
        }
        className="mt-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
      >
        Gerar Nome
      </button>
    )}
  </section>
);
