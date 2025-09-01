// @ts-nocheck

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
  character?: Character | null;
  location?: Location | null;
  selectedCharacter?: Character | null;
  selectedLocation?: Location | null;
}

const EntityRelationsGraph: React.FC<Props> = ({
  characters,
  locations,
  religions,
  character,
  location,
}) => {
  if (!character && !location) return null;

  const renderCharacterRelations = (char: Character) => {
    const charLocations = char.locationIds
      ?.map((id) => locations.find((l) => l.id === id)?.name)
      .filter(Boolean) as string[];

    const charReligions = char.religionIds
      ?.map((id) => religions.find((r) => r.id === id)?.name)
      .filter(Boolean) as string[];

    return (
      <>
        {charLocations && charLocations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Locais</h4>
            <ul className="list-disc list-inside text-sm">
              {charLocations.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {charReligions && charReligions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Religiões</h4>
            <ul className="list-disc list-inside text-sm">
              {charReligions.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };

  const renderLocationRelations = (loc: Location) => {
    const locCharacters = loc.characterIds
      ?.map((id) => characters.find((c) => c.id === id)?.name)
      .filter(Boolean) as string[];

    const locReligions = Array.from(
      new Set(
        (loc.characterIds || [])
          .flatMap((charId) => {
            const char = characters.find((c) => c.id === charId);
            return (
              char?.religionIds?.map((rid) => religions.find((r) => r.id === rid)?.name) || []
            );
          })
          .filter(Boolean)
      )
    ) as string[];

    return (
      <>
        {locCharacters && locCharacters.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Personagens</h4>
            <ul className="list-disc list-inside text-sm">
              {locCharacters.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {locReligions && locReligions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Religiões</h4>
            <ul className="list-disc list-inside text-sm">
              {locReligions.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="rounded-lg p-6 bg-panel shadow-token mt-4">
      {character && (
        <>
          <h3 className="text-lg font-bold mb-2">Relações de {character.name}</h3>
          {renderCharacterRelations(character)}
        </>
      )}

      {location && (
        <>
          <h3 className="text-lg font-bold mb-2">Relações de {location.name}</h3>
          {renderLocationRelations(location)}
        </>
      )}
    </section>
  );
};

export default EntityRelationsGraph;

