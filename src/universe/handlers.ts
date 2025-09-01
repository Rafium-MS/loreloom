import type {
  Character,
  Location,
  Economy,
  Religion,
  TimelineEvent,
  Language,
} from './types';

export const createCharacterSaver = ({
  selectedCharacter,
  saveCharacter,
  linkCharacterToLocation,
  unlinkCharacterFromLocation,
  linkCharacterToReligion,
  unlinkCharacterFromReligion,
  setSelectedCharacter,
  setShowCharacterForm,
}: {
  selectedCharacter: Character | null;
  saveCharacter: (c: Character) => Promise<void>;
  linkCharacterToLocation: (charId: number, locId: number) => Promise<void>;
  unlinkCharacterFromLocation: (charId: number, locId: number) => Promise<void>;
  linkCharacterToReligion: (charId: number, relId: number) => Promise<void>;
  unlinkCharacterFromReligion: (charId: number, relId: number) => Promise<void>;
  setSelectedCharacter: (c: Character | null) => void;
  setShowCharacterForm: (v: boolean) => void;
}) =>
  async (characterData: Character) => {
    await saveCharacter(characterData);

    const charId = characterData.id;
    const prevLocs = selectedCharacter?.locationIds || [];
    const newLocs = characterData.locationIds || [];

    for (const id of newLocs.filter((id) => !prevLocs.includes(id))) {
      await linkCharacterToLocation(charId, id);
    }
    for (const id of prevLocs.filter((id) => !newLocs.includes(id))) {
      await unlinkCharacterFromLocation(charId, id);
    }

    const prevRels = selectedCharacter?.religionIds || [];
    const newRels = characterData.religionIds || [];

    for (const id of newRels.filter((id) => !prevRels.includes(id))) {
      await linkCharacterToReligion(charId, id);
    }
    for (const id of prevRels.filter((id) => !newRels.includes(id))) {
      await unlinkCharacterFromReligion(charId, id);
    }

    setSelectedCharacter(null);
    setShowCharacterForm(false);
  };

export const createLocationSaver = ({
  selectedLocation,
  saveLocation,
  linkLocationToCharacter,
  unlinkLocationFromCharacter,
  setSelectedLocation,
  setShowLocationForm,
}: {
  selectedLocation: Location | null;
  saveLocation: (l: Location) => Promise<void>;
  linkLocationToCharacter: (locId: number, charId: number) => Promise<void>;
  unlinkLocationFromCharacter: (locId: number, charId: number) => Promise<void>;
  setSelectedLocation: (l: Location | null) => void;
  setShowLocationForm: (v: boolean) => void;
}) =>
  async (locationData: Location) => {
    await saveLocation(locationData);

    const locId = locationData.id;
    const prevChars = selectedLocation?.characterIds || [];
    const newChars = locationData.characterIds || [];

    for (const id of newChars.filter((id) => !prevChars.includes(id))) {
      await linkLocationToCharacter(locId, id);
    }
    for (const id of prevChars.filter((id) => !newChars.includes(id))) {
      await unlinkLocationFromCharacter(locId, id);
    }

    setSelectedLocation(null);
    setShowLocationForm(false);
  };

export const createEconomySaver = ({
  saveEconomy,
  setSelectedEconomy,
  setShowEconomyForm,
}: {
  saveEconomy: (e: Economy) => Promise<void>;
  setSelectedEconomy: (e: Economy | null) => void;
  setShowEconomyForm: (v: boolean) => void;
}) =>
  async (economyData: Economy) => {
    await saveEconomy(economyData);
    setSelectedEconomy(null);
    setShowEconomyForm(false);
  };

export const createReligionSaver = ({
  selectedReligion,
  saveReligion,
  linkReligionToCharacter,
  unlinkReligionFromCharacter,
  setSelectedReligion,
  setShowReligionForm,
}: {
  selectedReligion: Religion | null;
  saveReligion: (r: Religion) => Promise<void>;
  linkReligionToCharacter: (relId: number, charId: number) => Promise<void>;
  unlinkReligionFromCharacter: (relId: number, charId: number) => Promise<void>;
  setSelectedReligion: (r: Religion | null) => void;
  setShowReligionForm: (v: boolean) => void;
}) =>
  async (religionData: Religion) => {
    await saveReligion(religionData);

    const relId = religionData.id;
    const prevChars = selectedReligion?.characterIds || [];
    const newChars = religionData.characterIds || [];

    for (const id of newChars.filter((id) => !prevChars.includes(id))) {
      await linkReligionToCharacter(relId, id);
    }
    for (const id of prevChars.filter((id) => !newChars.includes(id))) {
      await unlinkReligionFromCharacter(relId, id);
    }

    setSelectedReligion(null);
    setShowReligionForm(false);
  };

export const createTimelineSaver = ({
  saveTimeline,
  setSelectedTimeline,
  setShowTimelineForm,
}: {
  saveTimeline: (t: TimelineEvent) => Promise<void>;
  setSelectedTimeline: (t: TimelineEvent | null) => void;
  setShowTimelineForm: (v: boolean) => void;
}) =>
  async (timelineData: TimelineEvent) => {
    await saveTimeline(timelineData);
    setSelectedTimeline(null);
    setShowTimelineForm(false);
  };

export const createLanguageSaver = ({
  saveLanguage,
  setSelectedLanguage,
  setShowLanguageForm,
}: {
  saveLanguage: (l: Language) => Promise<void>;
  setSelectedLanguage: (l: Language | null) => void;
  setShowLanguageForm: (v: boolean) => void;
}) =>
  async (languageData: Language) => {
    await saveLanguage(languageData);
    setSelectedLanguage(null);
    setShowLanguageForm(false);
  };
