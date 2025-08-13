import React, { useState } from 'react';
import { Device } from '../services/techRepository';
import styles from './TechSection.module.css';

interface DeviceListProps {
  devices: Device[];
  onAdd: (device: Omit<Device, 'id'>) => void;
  onUpdate: (device: Device) => void;
  onRemove: (id: string) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ devices, onAdd, onUpdate, onRemove }) => {
  const [form, setForm] = useState<Omit<Device, 'id'>>({
    name: '',
    trl: 1,
    risks: '',
    requirements: '',
  });

  const updateForm = (field: keyof Omit<Device, 'id'>, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd(form);
    setForm({ name: '', trl: 1, risks: '', requirements: '' });
  };

  return (
    <div className={styles.techSection}>
      <h3>Dispositivos / Protótipos</h3>
      <ul>
        {devices.map(d => (
          <li key={d.id}>
            <input value={d.name} onChange={e => onUpdate({ ...d, name: e.target.value })} />
            <input
              type="number"
              min={1}
              max={9}
              value={d.trl}
              onChange={e => onUpdate({ ...d, trl: parseInt(e.target.value, 10) || 1 })}
            />
            <input
              placeholder="Riscos"
              value={d.risks}
              onChange={e => onUpdate({ ...d, risks: e.target.value })}
            />
            <input
              placeholder="Requisitos"
              value={d.requirements}
              onChange={e => onUpdate({ ...d, requirements: e.target.value })}
            />
            <button onClick={() => onRemove(d.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={e => updateForm('name', e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={9}
          placeholder="TRL"
          value={form.trl}
          onChange={e => updateForm('trl', parseInt(e.target.value, 10) || 1)}
        />
        <input
          placeholder="Riscos"
          value={form.risks}
          onChange={e => updateForm('risks', e.target.value)}
        />
        <input
          placeholder="Requisitos"
          value={form.requirements}
          onChange={e => updateForm('requirements', e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>
    </div>
  );
};

export default DeviceList;
