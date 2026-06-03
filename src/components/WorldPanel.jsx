import React, { useState } from 'react'
import styles from './WorldPanel.module.css'

const roleTag = { Protagonista: 'hero', Antagonista: 'villain', Coadjuvante: 'supporting', Misteriosa: 'mystery' }
const genreTag = { Fantasia: 'fantasy', 'Sci-Fi': 'scifi', Ambos: 'both' }

function Card({ item, type, onClick }) {
  const icon = {
    characters: item.role === 'Antagonista' ? 'ti-eye-off' : item.role === 'Protagonista' ? 'ti-sword' : 'ti-sparkles',
    places: item.type === 'Planeta' || item.type === 'Estação Espacial' ? 'ti-planet' : item.type === 'Floresta' ? 'ti-trees' : item.type === 'Dimensão' ? 'ti-universe' : 'ti-building-castle',
    objects: item.type === 'Arma' ? 'ti-sword' : item.type === 'Tecnologia' ? 'ti-cpu' : 'ti-flame',
  }[type] || 'ti-star'

  const tag = type === 'characters'
    ? { label: item.role, cls: styles[`tag${item.role?.replace(/[^a-z]/gi, '') || 'hero'}`] || styles.tagSupporting }
    : type === 'places'
    ? { label: item.genre, cls: styles.tagPlace }
    : { label: item.type, cls: styles.tagObject }

  return (
    <div className={styles.card} onClick={() => onClick(item)}>
      <div className={styles.cardIcon}><i className={`ti ${icon}`} aria-hidden="true" /></div>
      <div className={styles.cardName}>{item.name || item.title}</div>
      <div className={styles.cardMeta}>{item.description}</div>
      <span className={`${styles.cardTag} ${tag.cls}`}>{tag.label}</span>
    </div>
  )
}

function DetailForm({ item, type, onBack }) {
  const [form, setForm] = useState({ ...item })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={styles.detailWrap}>
      <div className={styles.detailHeader}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Voltar">
          <i className="ti ti-arrow-left" aria-hidden="true" />
        </button>
        <span className={styles.detailTitle}>{form.name || form.title}</span>
        <button className={styles.dangerBtn}><i className="ti ti-trash" aria-hidden="true" /></button>
      </div>

      <div className={styles.formBody}>
        {type === 'characters' && <>
          <div className={`${styles.fg} ${styles.full}`}><label>Nome</label><input value={form.name || ''} onChange={e => set('name', e.target.value)} /></div>
          <div className={styles.fg}><label>Papel</label><select value={form.role || ''} onChange={e => set('role', e.target.value)}>{['Protagonista','Antagonista','Coadjuvante','Figurante','Misteriosa'].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className={styles.fg}><label>Espécie / Raça</label><input value={form.race || ''} onChange={e => set('race', e.target.value)} /></div>
          <div className={styles.fg}><label>Idade</label><input value={form.age || ''} onChange={e => set('age', e.target.value)} /></div>
          <div className={styles.fg}><label>Ocupação</label><input value={form.occupation || ''} onChange={e => set('occupation', e.target.value)} /></div>
          <div className={`${styles.fg} ${styles.full}`}><label>Descrição & Motivações</label><textarea value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
          <div className={`${styles.fg} ${styles.full}`}><label>Arco do Personagem</label><textarea value={form.arc || ''} onChange={e => set('arc', e.target.value)} /></div>
          <div className={`${styles.fg} ${styles.full}`}><label>Relações</label><input value={form.relations || ''} onChange={e => set('relations', e.target.value)} /></div>
          <div className={`${styles.fg} ${styles.full}`}><label>Notas</label><textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} /></div>
        </>}

        {type === 'places' && <>
          <div className={`${styles.fg} ${styles.full}`}><label>Nome</label><input value={form.name || ''} onChange={e => set('name', e.target.value)} /></div>
          <div className={styles.fg}><label>Tipo</label><select value={form.type || ''} onChange={e => set('type', e.target.value)}>{['Cidade','Floresta','Planeta','Dimensão','Fortaleza','Ruína','Outro'].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className={styles.fg}><label>Gênero</label><select value={form.genre || ''} onChange={e => set('genre', e.target.value)}>{['Fantasia','Sci-Fi','Ambos'].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className={`${styles.fg} ${styles.full}`}><label>Descrição</label><textarea value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
        </>}

        {type === 'objects' && <>
          <div className={`${styles.fg} ${styles.full}`}><label>Nome</label><input value={form.name || ''} onChange={e => set('name', e.target.value)} /></div>
          <div className={`${styles.fg}`}><label>Tipo</label><select value={form.type || ''} onChange={e => set('type', e.target.value)}>{['Artefato Mágico','Arma','Tecnologia','Relíquia','Outro'].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className={`${styles.fg} ${styles.full}`}><label>Poderes / Função</label><textarea value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
        </>}
      </div>

      <div className={styles.formActions}>
        <button className={styles.cancelBtn} onClick={onBack}>Cancelar</button>
        <button className={styles.saveBtn}>Salvar</button>
      </div>
    </div>
  )
}

export default function WorldPanel({ type, items, onAdd }) {
  const [selected, setSelected] = useState(null)

  const headings = { characters: 'Personagens', places: 'Lugares', objects: 'Objetos & Artefatos' }
  const icons = { characters: 'ti-users', places: 'ti-map-pin', objects: 'ti-wand' }

  if (selected) return <DetailForm item={selected} type={type} onBack={() => setSelected(null)} />

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>
          <i className={`ti ${icons[type]}`} aria-hidden="true" style={{ color: 'var(--gold)' }} />
          {headings[type]}
        </h2>
        <button className={styles.addBtn} onClick={onAdd}>
          <i className="ti ti-plus" aria-hidden="true" /> Novo
        </button>
      </div>
      <div className={styles.grid}>
        {items.map(item => (
          <Card key={item.id} item={item} type={type} onClick={setSelected} />
        ))}
      </div>
    </div>
  )
}
