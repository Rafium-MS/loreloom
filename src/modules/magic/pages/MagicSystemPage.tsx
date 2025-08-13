import React, { useState } from 'react';
import MagicSystemForm from '../components/MagicSystemForm';
import SchoolList from '../components/SchoolList';
import UserList from '../components/UserList';
import ArtifactList from '../components/ArtifactList';
import {
  magicRepository,
  MagicSystem,
  School,
  User,
  Artifact,
} from '../services/magicRepository';

const MagicSystemPage: React.FC = () => {
  const [system, setSystem] = useState<MagicSystem>(() => magicRepository.getSystem());

  const refresh = () => setSystem(magicRepository.getSystem());

  return (
    <div>
      <h1>Sistema de Magia</h1>
      <MagicSystemForm
        rules={system.rules}
        onChange={value => {
          magicRepository.updateRules(value);
          refresh();
        }}
      />
      <SchoolList
        schools={system.schools}
        onAdd={name => {
          magicRepository.addSchool(name);
          refresh();
        }}
        onUpdate={(school: School) => {
          magicRepository.updateSchool(school);
          refresh();
        }}
        onRemove={(id: string) => {
          magicRepository.removeSchool(id);
          refresh();
        }}
      />
      <UserList
        users={system.users}
        onAdd={(name, role) => {
          magicRepository.addUser(name, role);
          refresh();
        }}
        onUpdate={(user: User) => {
          magicRepository.updateUser(user);
          refresh();
        }}
        onRemove={(id: string) => {
          magicRepository.removeUser(id);
          refresh();
        }}
      />
      <ArtifactList
        artifacts={system.artifacts}
        onAdd={(artifact: Omit<Artifact, 'id'>) => {
          magicRepository.addArtifact(artifact);
          refresh();
        }}
        onUpdate={(artifact: Artifact) => {
          magicRepository.updateArtifact(artifact);
          refresh();
        }}
        onRemove={(id: string) => {
          magicRepository.removeArtifact(id);
          refresh();
        }}
      />
    </div>
  );
};

export default MagicSystemPage;