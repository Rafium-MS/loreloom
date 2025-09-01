import React from 'react';

interface Character {
  id: number;
  name: string;
  locationIds?: number[];
  religionIds?: number[];
  relationships?: string;
}

interface Location {
  id: number;
  name: string;
  characterIds?: number[];
  religions?: string[];
}

interface Religion {
  id: number;
  name: string;
  characterIds?: number[];
}

interface Props {
  characters: Character[];
  locations: Location[];
  religions: Religion[];
  selectedCharacter?: Character | null;
  selectedLocation?: Location | null;
}

const EntityRelationsGraph: React.FC<Props> = ({
  characters,
  locations,
  religions,
  selectedCharacter,
  selectedLocation,
}) => {
  if (!selectedCharacter && !selectedLocation) return null;

  if (selectedCharacter) {
    const linkedLocations = locations.filter((l) =>
      selectedCharacter.locationIds?.includes(l.id)
    );
    const linkedReligions = religions.filter((r) =>
      selectedCharacter.religionIds?.includes(r.id)
    );
    const relatedCharacters = selectedCharacter.relationships
      ? characters.filter((c) =>
          selectedCharacter.relationships!
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .includes(c.name.toLowerCase())
        )
      : [];

    return (
      <section className="rounded-lg p-6 bg-panel shadow-token mt-4">
        <h3 className="text-xl font-bold mb-4">
          Relações de {selectedCharacter.name}
        </h3>
        <div className="space-y-2 text-sm">
          {relatedCharacters.length > 0 && (
            <p>
              <span className="font-semibold">Personagens:</span>{' '}
              {relatedCharacters.map((c) => c.name).join(', ')}
            </p>
          )}
          {linkedLocations.length > 0 && (
            <p>
              <span className="font-semibold">Localizações:</span>{' '}
              {linkedLocations.map((l) => l.name).join(', ')}
            </p>
          )}
          {linkedReligions.length > 0 && (
            <p>
              <span className="font-semibold">Religiões:</span>{' '}
              {linkedReligions.map((r) => r.name).join(', ')}
            </p>
          )}
          {relatedCharacters.length === 0 &&
            linkedLocations.length === 0 &&
            linkedReligions.length === 0 && <p>Nenhuma relação encontrada.</p>}
        </div>
      </section>
    );
  }

  if (selectedLocation) {
    const linkedCharacters = characters.filter((c) =>
      c.locationIds?.includes(selectedLocation.id)
    );
    const locationReligions =
      selectedLocation.religions && selectedLocation.religions.length > 0
        ? selectedLocation.religions
        : religions
            .filter((r) =>
              linkedCharacters.some((c) => c.religionIds?.includes(r.id))
            )
            .map((r) => r.name);

    return (
      <section className="rounded-lg p-6 bg-panel shadow-token mt-4">
        <h3 className="text-xl font-bold mb-4">
          Relações de {selectedLocation.name}
        </h3>
        <div className="space-y-2 text-sm">
          {linkedCharacters.length > 0 && (
            <p>
              <span className="font-semibold">Personagens:</span>{' '}
              {linkedCharacters.map((c) => c.name).join(', ')}
            </p>
          )}
          {locationReligions.length > 0 && (
            <p>
              <span className="font-semibold">Religiões:</span>{' '}
              {locationReligions.join(', ')}
            </p>
          )}
          {linkedCharacters.length === 0 &&
            locationReligions.length === 0 && <p>Nenhuma relação encontrada.</p>}
        </div>
      </section>
    );
  }

  return null;
};

export default EntityRelationsGraph;
