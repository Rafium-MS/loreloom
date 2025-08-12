import React, { useState } from 'react';
import './MagicSystemBuilder.css'; // Certifique-se de criar este arquivo CSS

const MagicSystemBuilder = () => {
  const [system, setSystem] = useState({
    name: '',
    description: '',
    limitations: '',
    cost: '',
    schools: [],
    users: [],
    artifacts: [],
  });

  const [newSchool, setNewSchool] = useState('');
  const [newUser, setNewUser] = useState({ name: '', specialty: '' });
  const [newArtifact, setNewArtifact] = useState({ name: '', properties: '' });

  const handleSystemChange = (e) => {
    const { name, value } = e.target;
    setSystem(prev => ({ ...prev, [name]: value }));
  };

  const addSchool = () => {
    if (newSchool.trim() !== '') {
      setSystem(prev => ({ ...prev, schools: [...prev.schools, newSchool] }));
      setNewSchool('');
    }
  };

  const removeSchool = (index) => {
    setSystem(prev => ({
      ...prev,
      schools: prev.schools.filter((_, i) => i !== index),
    }));
  };

  const addUser = () => {
    if (newUser.name.trim() !== '' && newUser.specialty.trim() !== '') {
      setSystem(prev => ({ ...prev, users: [...prev.users, newUser] }));
      setNewUser({ name: '', specialty: '' });
    }
  };

  const removeUser = (index) => {
    setSystem(prev => ({
      ...prev,
      users: prev.users.filter((_, i) => i !== index),
    }));
  };

  const addArtifact = () => {
    if (newArtifact.name.trim() !== '' && newArtifact.properties.trim() !== '') {
      setSystem(prev => ({ ...prev, artifacts: [...prev.artifacts, newArtifact] }));
      setNewArtifact({ name: '', properties: '' });
    }
  };

  const removeArtifact = (index) => {
    setSystem(prev => ({
      ...prev,
      artifacts: prev.artifacts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sistema de Magia Criado:", system);
    alert("Seu sistema de magia foi salvo no console!");
  };

  return (
    <div className="magic-system-builder">
      <h1>Magic System Builder</h1>
      <p className="subtitle">Crie e organize os sistemas de magia para seus universos fantásticos.</p>

      <form onSubmit={handleSubmit}>
        {/* Informações Básicas do Sistema */}
        <section className="input-group">
          <h2>Criação do Sistema de Magia/Poderes</h2>
          <label>Nome do Sistema:</label>
          <input
            type="text"
            name="name"
            value={system.name}
            onChange={handleSystemChange}
            placeholder="Ex: Magia Elemental, Sopro Divino, etc."
            required
          />
          <label>Descrição do Sistema:</label>
          <textarea
            name="description"
            value={system.description}
            onChange={handleSystemChange}
            placeholder="Descreva o que seu sistema de magia pode fazer e como funciona em linhas gerais."
            rows="4"
          ></textarea>
        </section>

        {/* Limitações e Custos */}
        <section className="input-group">
          <h2>Limitações e Custos da Magia</h2>
          <label>Limitações (O que a magia NÃO pode fazer?):</label>
          <textarea
            name="limitations"
            value={system.limitations}
            onChange={handleSystemChange}
            placeholder="Ex: Não pode ressuscitar mortos, não pode criar matéria do nada, etc."
            rows="3"
          ></textarea>
          <label>Custo da Magia (O que o usuário gasta para usar?):</label>
          <textarea
            name="cost"
            value={system.cost}
            onChange={handleSystemChange}
            placeholder="Ex: Energia vital, Mana, um sacrifício, dor física, etc."
            rows="3"
          ></textarea>
        </section>

        {/* Escolas ou Tipos de Magia */}
        <section className="input-group">
          <h2>Escolas ou Tipos de Magia</h2>
          <div className="add-item">
            <input
              type="text"
              value={newSchool}
              onChange={(e) => setNewSchool(e.target.value)}
              placeholder="Ex: Piromancia, Necromancia, Ilusionismo"
            />
            <button type="button" onClick={addSchool}>Adicionar</button>
          </div>
          <ul className="item-list">
            {system.schools.map((school, index) => (
              <li key={index}>
                {school}
                <button type="button" onClick={() => removeSchool(index)}>Remover</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Usuários de Magia */}
        <section className="input-group">
          <h2>Usuários de Magia e Suas Especialidades</h2>
          <div className="add-item">
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do usuário"
            />
            <input
              type="text"
              name="specialty"
              value={newUser.specialty}
              onChange={(e) => setNewUser(prev => ({ ...prev, specialty: e.target.value }))}
              placeholder="Especialidade (Ex: Mago da Guerra)"
            />
            <button type="button" onClick={addUser}>Adicionar</button>
          </div>
          <ul className="item-list">
            {system.users.map((user, index) => (
              <li key={index}>
                <strong>{user.name}</strong> - {user.specialty}
                <button type="button" onClick={() => removeUser(index)}>Remover</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Artefatos Mágicos */}
        <section className="input-group">
          <h2>Artefatos Mágicos e Suas Propriedades</h2>
          <div className="add-item">
            <input
              type="text"
              name="name"
              value={newArtifact.name}
              onChange={(e) => setNewArtifact(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do artefato"
            />
            <input
              type="text"
              name="properties"
              value={newArtifact.properties}
              onChange={(e) => setNewArtifact(prev => ({ ...prev, properties: e.target.value }))}
              placeholder="Propriedades (Ex: Espada que corta a realidade)"
            />
            <button type="button" onClick={addArtifact}>Adicionar</button>
          </div>
          <ul className="item-list">
            {system.artifacts.map((artifact, index) => (
              <li key={index}>
                <strong>{artifact.name}</strong> - {artifact.properties}
                <button type="button" onClick={() => removeArtifact(index)}>Remover</button>
              </li>
            ))}
          </ul>
        </section>

        <button type="submit" className="submit-button">Salvar Sistema de Magia</button>
      </form>
    </div>
  );
};

export default MagicSystemBuilder;