import React, { useState } from 'react'
import styles from './RacesPanel.module.css'

/* ── Genre-aware labels ── */
const LABELS = {
  fantasy: {
    singular:    'Raça',
    plural:      'Raças',
    abilities:   'Habilidades & Magia',
    homeland:    'Reino / Região de Origem',
    abilitiesph: 'Poderes mágicos, resistências, dom inato…',
    tags:        ['Mortal', 'Imortal', 'Semidivina', 'Demoníaca', 'Feérica', 'Bestial', 'Elemental', 'Antiga'],
  },
  scifi: {
    singular:    'Espécie',
    plural:      'Espécies',
    abilities:   'Adaptações & Biotecnologia',
    homeland:    'Sistema / Planeta de Origem',
    abilitiesph: 'Adaptações biológicas, implantes, capacidades únicas…',
    tags:        ['Orgânica', 'Cibernética', 'Energia Pura', 'Parasita', 'Coletiva', 'Clonada', 'Ancestral', 'Extinta'],
  },
}

const POPULATION_OPTS = ['Desconhecida', 'Rara', 'Incomum', 'Comum', 'Abundante', 'Dominante', 'Extinta / Extinta quase']

const EMPTY_RACE = {
  name: '', description: '', appearance: '', lifespan: '',
  homeland: '', population: 'Comum', culture: '',
  abilities: '', history: '', relations: '', notes: '',
  tags: [],
}

/* ── Tag chip ── */
function TagChip({ label, active, onToggle }) {
  return (
    <button
      className={`${styles.tag} ${active ? styles.tagActive : ''}`}
      onClick={() => onToggle(label)}
    >
      {label}
    </button>
  )
}

/* ── Race list item ── */
function RaceItem({ race, active, onClick }) {
  return (
    <button className={`${styles.listItem} ${active ? styles.listItemActive : ''}`} onClick={onClick}>
      <div className={styles.listAvatar}>
        {race.name.charAt(0).toUpperCase()}
      </div>
      <div className={styles.listInfo}>
        <span className={styles.listName}>{race.name}</span>
        <span className={styles.listSub}>{race.homeland || 'Origem desconhecida'}</span>
      </div>
      {race.tags?.length > 0 && (
        <span className={styles.listTagCount}>{race.tags.length}</span>
      )}
    </button>
  )
}

/* ── Section block ── */
function Section({ icon, title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className={styles.section}>
      <button className={styles.sectionToggle} onClick={() => setOpen(o => !o)}>
        <i className={`ti ${icon}`} />
        <span>{title}</span>
        <i className={`ti ${open ? 'ti-chevron-up' : 'ti-chevron-down'} ${styles.chevron}`} />
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  )
}

/* ── Field helpers ── */
function Field({ label, children, full }) {
  return (
    <div className={`${styles.fg} ${full ? styles.full : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  )
}

/* ── Detail view ── */
function RaceDetail({ race, labels, onChange, onDelete, onBack }) {
  const set = (k, v) => onChange({ ...race, [k]: v })
  const toggleTag = (tag) => {
    const tags = race.tags || []
    set('tags', tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
  }

  return (
    <div className={styles.detail}>
      {/* Header */}
      <div className={styles.detailHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <i className="ti ti-arrow-left" />
        </button>
        <div className={styles.detailAvatar}>{race.name.charAt(0).toUpperCase()}</div>
        <input
          className={styles.nameInput}
          value={race.name}
          onChange={e => set('name', e.target.value)}
          placeholder={`Nome da ${labels.singular}`}
        />
        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(race.id)} title="Excluir">
          <i className="ti ti-trash" />
        </button>
      </div>

      {/* Tags */}
      <div className={styles.tagsRow}>
        <span className={styles.tagsLabel}>Classificação:</span>
        {labels.tags.map(t => (
          <TagChip key={t} label={t} active={(race.tags || []).includes(t)} onToggle={toggleTag} />
        ))}
      </div>

      {/* Scrollable form */}
      <div className={styles.detailBody}>

        <Section icon="ti-info-circle" title="Visão Geral">
          <div className={styles.formGrid}>
            <Field label="Descrição breve" full>
              <textarea value={race.description || ''} onChange={e => set('description', e.target.value)} placeholder="Quem são? Qual o papel no mundo?" />
            </Field>
            <Field label={labels.homeland}>
              <input value={race.homeland || ''} onChange={e => set('homeland', e.target.value)} placeholder="ex: Floresta Eterna de Lyranith" />
            </Field>
            <Field label="Expectativa de Vida">
              <input value={race.lifespan || ''} onChange={e => set('lifespan', e.target.value)} placeholder="ex: 200–500 anos, Imortal" />
            </Field>
            <Field label="População">
              <select value={race.population || 'Comum'} onChange={e => set('population', e.target.value)}>
                {POPULATION_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Section icon="ti-eye" title="Aparência Física">
          <div className={styles.formGrid}>
            <Field label="Características Físicas" full>
              <textarea value={race.appearance || ''} onChange={e => set('appearance', e.target.value)} placeholder="Altura, traços marcantes, cores, biotipo…" />
            </Field>
          </div>
        </Section>

        <Section icon={labels.abilities === 'Habilidades & Magia' ? 'ti-wand' : 'ti-dna'} title={labels.abilities}>
          <div className={styles.formGrid}>
            <Field label="Poderes & Traços Especiais" full>
              <textarea value={race.abilities || ''} onChange={e => set('abilities', e.target.value)} placeholder={labels.abilitiesph} />
            </Field>
          </div>
        </Section>

        <Section icon="ti-users" title="Cultura & Sociedade">
          <div className={styles.formGrid}>
            <Field label="Organização Social, Costumes & Crenças" full>
              <textarea value={race.culture || ''} onChange={e => set('culture', e.target.value)} placeholder="Como se organizam? O que valorizam? Rituais…" />
            </Field>
          </div>
        </Section>

        <Section icon="ti-timeline" title="História & Origem">
          <div className={styles.formGrid}>
            <Field label="Origem & Eventos Históricos" full>
              <textarea value={race.history || ''} onChange={e => set('history', e.target.value)} placeholder="Como surgiram? Guerras, migrações, grandes eventos…" />
            </Field>
          </div>
        </Section>

        <Section icon="ti-arrows-exchange" title="Relações com Outras Raças">
          <div className={styles.formGrid}>
            <Field label="Alianças, Rivalidades & Neutralidades" full>
              <textarea value={race.relations || ''} onChange={e => set('relations', e.target.value)} placeholder="Como se relacionam com os outros povos?" />
            </Field>
          </div>
        </Section>

        <Section icon="ti-notebook" title="Notas do Escritor">
          <div className={styles.formGrid}>
            <Field label="Anotações Livres" full>
              <textarea value={race.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Referências, inspirações, ideias pendentes…" />
            </Field>
          </div>
        </Section>

      </div>
    </div>
  )
}

/* ── Main panel ── */
export default function RacesPanel({ genre }) {
  const genreId = genre?.id || 'fantasy'
  const labels = LABELS[genreId] || LABELS.fantasy

  const [races, setRaces] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')

  const selected = races.find(r => r.id === selectedId)

  const addRace = () => {
    const r = { id: Date.now(), ...EMPTY_RACE }
    setRaces(rs => [...rs, r])
    setSelectedId(r.id)
  }

  const updateRace = (updated) => setRaces(rs => rs.map(r => r.id === updated.id ? updated : r))

  const deleteRace = (id) => {
    setRaces(rs => rs.filter(r => r.id !== id))
    setSelectedId(null)
  }

  const filtered = races.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className={styles.panel}>
      {/* Sidebar list */}
      <aside className={styles.list}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>{labels.plural}</span>
          <button className={styles.newBtn} onClick={addRace} title={`Nova ${labels.singular}`}>
            <i className="ti ti-plus" />
          </button>
        </div>

        <div className={styles.listSearch}>
          <i className="ti ti-search" />
          <input
            placeholder={`Buscar ${labels.plural.toLowerCase()}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.listItems}>
          {filtered.map(r => (
            <RaceItem
              key={r.id}
              race={r}
              active={selectedId === r.id}
              onClick={() => setSelectedId(r.id)}
            />
          ))}
          {filtered.length === 0 && (
            <p className={styles.emptyHint}>
              {search ? 'Nenhum resultado.' : `Nenhuma ${labels.singular.toLowerCase()} ainda.\nCrie a primeira!`}
            </p>
          )}
        </div>

        <div className={styles.listFooter}>
          {races.length} {races.length === 1 ? labels.singular.toLowerCase() : labels.plural.toLowerCase()}
        </div>
      </aside>

      {/* Detail area */}
      <div className={styles.content}>
        {selected ? (
          <RaceDetail
            race={selected}
            labels={labels}
            onChange={updateRace}
            onDelete={deleteRace}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className={styles.placeholder}>
            <i className={`ti ${genre?.nav?.races?.icon || 'ti-shield-half'}`} />
            <p>Selecione uma {labels.singular.toLowerCase()} ou crie uma nova</p>
            <button className={styles.addBtn} onClick={addRace}>
              <i className="ti ti-plus" /> Nova {labels.singular}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
