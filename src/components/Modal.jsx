import React, { useState } from 'react'
import styles from './Modal.module.css'

const configs = {
  character: {
    icon: 'ti-user', title: 'Novo Personagem',
    fields: [
      { label: 'Nome', key: 'name', type: 'text', placeholder: 'Nome do personagem' },
      { label: 'Papel', key: 'role', type: 'select', options: ['Protagonista', 'Antagonista', 'Coadjuvante', 'Figurante'] },
      { label: 'Espécie / Raça', key: 'race', type: 'text', placeholder: 'Humano, Élfico, Andróide...' },
      { label: 'Idade', key: 'age', type: 'text', placeholder: 'Ex: 34' },
      { label: 'Ocupação', key: 'occupation', type: 'text', placeholder: 'Ex: Soldado, Mago...' },
      { label: 'Descrição', key: 'description', type: 'textarea', placeholder: 'Quem é este personagem?' },
    ],
  },
  place: {
    icon: 'ti-map-pin', title: 'Novo Lugar',
    fields: [
      { label: 'Nome', key: 'name', type: 'text', placeholder: 'Nome do local' },
      { label: 'Tipo', key: 'type', type: 'select', options: ['Cidade', 'Floresta', 'Planeta', 'Dimensão', 'Fortaleza', 'Ruína', 'Outro'] },
      { label: 'Gênero', key: 'genre', type: 'select', options: ['Fantasia', 'Sci-Fi', 'Ambos'] },
      { label: 'Descrição', key: 'description', type: 'textarea', placeholder: 'Descreva este lugar...' },
    ],
  },
  object: {
    icon: 'ti-wand', title: 'Novo Objeto',
    fields: [
      { label: 'Nome', key: 'name', type: 'text', placeholder: 'Nome do artefato' },
      { label: 'Tipo', key: 'type', type: 'select', options: ['Artefato Mágico', 'Arma', 'Tecnologia', 'Relíquia', 'Outro'] },
      { label: 'Poderes / Função', key: 'description', type: 'textarea', placeholder: 'O que este objeto faz?' },
    ],
  },
  event: {
    icon: 'ti-calendar-event', title: 'Novo Evento',
    fields: [
      { label: 'Título', key: 'title', type: 'text', placeholder: 'Nome do evento' },
      { label: 'Data / Era', key: 'date', type: 'text', placeholder: 'Ano 1.237 — Era do Véu' },
      { label: 'Importância', key: 'importance', type: 'select', options: ['Evento Principal', 'Evento Secundário', 'Backstory', 'Futuro Planejado'] },
      { label: 'Descrição', key: 'description', type: 'textarea', placeholder: 'O que aconteceu?' },
    ],
  },
  chapter: {
    icon: 'ti-book', title: 'Novo Capítulo',
    fields: [
      { label: 'Título', key: 'title', type: 'text', placeholder: 'Título do capítulo' },
      { label: 'Tipo', key: 'type', type: 'select', options: ['Capítulo', 'Prólogo', 'Epílogo', 'Interlúdio'] },
      { label: 'Sinopse', key: 'synopsis', type: 'textarea', placeholder: 'O que acontece neste capítulo?' },
    ],
  },
}

export default function Modal({ type, onClose, onConfirm }) {
  const config = configs[type]
  const [form, setForm] = useState({})

  if (!config) return null

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <i className={`ti ${config.icon}`} aria-hidden="true" style={{ color: 'var(--gold)', fontSize: 18 }} />
          <span className={styles.title}>{config.title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          {config.fields.map(f => (
            <div key={f.key} className={styles.formGroup}>
              <label>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  placeholder={f.placeholder}
                  value={form[f.key] || ''}
                  onChange={e => handleChange(f.key, e.target.value)}
                />
              ) : f.type === 'select' ? (
                <select value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)}>
                  <option value="">Selecionar...</option>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={form[f.key] || ''}
                  onChange={e => handleChange(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button className={styles.confirmBtn} onClick={() => onConfirm(form)}>Criar</button>
        </div>
      </div>
    </div>
  )
}
