import React, { useState } from 'react';
import TechSystemForm from '../components/TechSystemForm';
import DomainList from '../components/DomainList';
import PractitionerList from '../components/PractitionerList';
import DeviceList from '../components/DeviceList';
import {
  techRepository,
  TechSystem,
  Domain,
  Practitioner,
  Device,
} from '../services/techRepository';
import styles from './TechSystemPage.module.css';

const TechSystemPage: React.FC = () => {
  const [system, setSystem] = useState<TechSystem>(() => techRepository.getSystem());

  const refresh = () => setSystem(techRepository.getSystem());

  return (
    <div className={styles.techSystemPage}>
      <h1>Sistema Tecnológico</h1>
      <TechSystemForm
        paradigm={system.paradigm}
        onChange={value => {
          techRepository.updateParadigm(value);
          refresh();
        }}
      />
      <DomainList
        domains={system.domains}
        onAdd={name => {
          techRepository.addDomain(name);
          refresh();
        }}
        onUpdate={(domain: Domain) => {
          techRepository.updateDomain(domain);
          refresh();
        }}
        onRemove={(id: string) => {
          techRepository.removeDomain(id);
          refresh();
        }}
      />
      <PractitionerList
        practitioners={system.practitioners}
        onAdd={(name, type) => {
          techRepository.addPractitioner(name, type);
          refresh();
        }}
        onUpdate={(p: Practitioner) => {
          techRepository.updatePractitioner(p);
          refresh();
        }}
        onRemove={(id: string) => {
          techRepository.removePractitioner(id);
          refresh();
        }}
      />
      <DeviceList
        devices={system.devices}
        onAdd={(device: Omit<Device, 'id'>) => {
          techRepository.addDevice(device);
          refresh();
        }}
        onUpdate={(device: Device) => {
          techRepository.updateDevice(device);
          refresh();
        }}
        onRemove={(id: string) => {
          techRepository.removeDevice(id);
          refresh();
        }}
      />
    </div>
  );
};

export default TechSystemPage;