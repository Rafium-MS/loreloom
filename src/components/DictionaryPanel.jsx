import React, { useState } from 'react'
import styles from './DictionaryPanel.module.css'

const WORD_TYPES = ['Substantivo', 'Verbo', 'Adjetivo', 'Expressão', 'Outros']

const EMPTY_LANG = { name: '', description: '', phonetics: '' }
const EMPTY_WORD = { word: '', phonetic: '', meaning: '', type: 'Substantivo', notes: '' }

function LangForm({ initial = EMPTY_LANG, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className={styles.langForm}>
      <div className={styles.fg}>
        <label>Nome da Língua</label>
        <input placeholder="ex: Alto Élfico, Klingon…" value={form.name} onChange={e => set('name', e.target.value)} />
      </div>
      <div className={styles.fg}>
        <label>Descrição</label>
        <input placeholder="Quem fala? Onde é usada?" value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div className={styles.fg}>
        <label>Regras Fonéticas</label>
        <textarea placeholder="ex: vogais alongadas, 'th' aspirado, acento na penúltima sílaba…" value={form.phonetics} onChange={e => set('phonetics', e.target.value)} />
      </div>
      <div className={styles.formActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
        <button className={styles.saveBtn} onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Salvar</button>
      </div>
    </div>
  )
}

function WordRow({ word, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <tr className={`${styles.row} ${open ? styles.rowOpen : ''}`} onClick={() => setOpen(o => !o)}>
        <td className={styles.cellWord}>{word.word}</td>
        <td className={styles.cellPhonetic}>{word.phonetic || <span className={styles.empty}>—</span>}</td>
        <td className={styles.cellMeaning}>{word.meaning}</td>
        <td><span className={`${styles.typeTag} ${styles[`type${word.type}`]}`}>{word.type}</span></td>
        <td className={styles.cellActions} onClick={e => e.stopPropagation()}>
          <button className={styles.iconBtn} onClick={() => onEdit(word)} title="Editar"><i className="ti ti-pencil" /></button>
          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(word.id)} title="Excluir"><i className="ti ti-trash" /></button>
        </td>
      </tr>
      {open && word.notes && (
        <tr className={styles.notesRow}>
          <td colSpan={5}><span className={styles.notesLabel}>Notas:</span> {word.notes}</td>
        </tr>
      )}
    </>
  )
}

function WordFormRow({ initial = EMPTY_WORD, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <tr className={styles.wordFormRow}>
      <td><input className={styles.inlineInput} placeholder="Palavra" value={form.word} onChange={e => set('word', e.target.value)} autoFocus /></td>
      <td><input className={styles.inlineInput} placeholder="Fonética" value={form.phonetic} onChange={e => set('phonetic', e.target.value)} /></td>
      <td><input className={styles.inlineInput} placeholder="Significado" value={form.meaning} onChange={e => set('meaning', e.target.value)} /></td>
      <td>
        <select className={styles.inlineSelect} value={form.type} onChange={e => set('type', e.target.value)}>
          {WORD_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </td>
      <td className={styles.cellActions}>
        <button className={styles.iconBtn} onClick={() => form.word.trim() && onSave(form)} title="Confirmar"><i className="ti ti-check" /></button>
        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={onCancel} title="Cancelar"><i className="ti ti-x" /></button>
      </td>
    </tr>
  )
}

function LangView({ lang, onUpdate, onDelete }) {
  const [editingLang, setEditingLang] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Todos')
  const [addingWord, setAddingWord] = useState(false)
  const [editingWord, setEditingWord] = useState(null)

  const words = lang.words || []

  const filtered = words.filter(w => {
    const q = search.toLowerCase()
    const matchSearch = !q || w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
    const matchType = filterType === 'Todos' || w.type === filterType
    return matchSearch && matchType
  })

  const addWord = (form) => {
    const updated = { ...lang, words: [...words, { id: Date.now(), ...form }] }
    onUpdate(updated)
    setAddingWord(false)
  }

  const updateWord = (form) => {
    const updated = { ...lang, words: words.map(w => w.id === form.id ? form : w) }
    onUpdate(updated)
    setEditingWord(null)
  }

  const deleteWord = (id) => {
    onUpdate({ ...lang, words: words.filter(w => w.id !== id) })
  }

  if (editingLang) {
    return (
      <div className={styles.langView}>
        <LangForm initial={lang} onSave={f => { onUpdate({ ...lang, ...f }); setEditingLang(false) }} onCancel={() => setEditingLang(false)} />
      </div>
    )
  }

  return (
    <div className={styles.langView}>
      <div className={styles.langHeader}>
        <div className={styles.langInfo}>
          <h2 className={styles.langName}>{lang.name}</h2>
          {lang.description && <p className={styles.langDesc}>{lang.description}</p>}
          {lang.phonetics && (
            <div className={styles.phoneticBox}>
              <i className="ti ti-music" /> <span>{lang.phonetics}</span>
            </div>
          )}
        </div>
        <div className={styles.langHeaderActions}>
          <button className={styles.iconBtn} onClick={() => setEditingLang(true)} title="Editar língua"><i className="ti ti-pencil" /></button>
          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(lang.id)} title="Excluir língua"><i className="ti ti-trash" /></button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <i className="ti ti-search" />
          <input placeholder="Buscar palavra ou significado…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className={styles.filters}>
          {['Todos', ...WORD_TYPES].map(t => (
            <button key={t} className={`${styles.filterBtn} ${filterType === t ? styles.filterActive : ''}`} onClick={() => setFilterType(t)}>{t}</button>
          ))}
        </div>
        <button className={styles.addWordBtn} onClick={() => { setAddingWord(true); setEditingWord(null) }}>
          <i className="ti ti-plus" /> Palavra
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Palavra</th>
              <th>Fonética</th>
              <th>Significado</th>
              <th>Tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {addingWord && (
              <WordFormRow onSave={addWord} onCancel={() => setAddingWord(false)} />
            )}
            {filtered.map(w =>
              editingWord?.id === w.id
                ? <WordFormRow key={w.id} initial={w} onSave={updateWord} onCancel={() => setEditingWord(null)} />
                : <WordRow key={w.id} word={w} onEdit={setEditingWord} onDelete={deleteWord} />
            )}
            {filtered.length === 0 && !addingWord && (
              <tr><td colSpan={5} className={styles.empty}>Nenhuma palavra encontrada. Adicione a primeira!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.wordCount}>{words.length} {words.length === 1 ? 'palavra' : 'palavras'} no dicionário</div>
    </div>
  )
}

export default function DictionaryPanel() {
  const [languages, setLanguages] = useState([])
  const [selected, setSelected] = useState(null)
  const [creatingLang, setCreatingLang] = useState(false)

  const createLang = (form) => {
    const lang = { id: Date.now(), words: [], ...form }
    setLanguages(ls => [...ls, lang])
    setSelected(lang.id)
    setCreatingLang(false)
  }

  const updateLang = (updated) => {
    setLanguages(ls => ls.map(l => l.id === updated.id ? updated : l))
    setSelected(updated.id)
  }

  const deleteLang = (id) => {
    setLanguages(ls => ls.filter(l => l.id !== id))
    setSelected(null)
  }

  const currentLang = languages.find(l => l.id === selected)

  return (
    <div className={styles.panel}>
      <aside className={styles.langList}>
        <div className={styles.langListHeader}>
          <span className={styles.langListTitle}>Línguas</span>
          <button className={styles.newLangBtn} onClick={() => { setCreatingLang(true) }} title="Nova língua">
            <i className="ti ti-plus" />
          </button>
        </div>

        {languages.map(l => (
          <button key={l.id} className={`${styles.langItem} ${selected === l.id ? styles.langItemActive : ''}`} onClick={() => { setSelected(l.id); setCreatingLang(false) }}>
            <i className="ti ti-language" />
            <div className={styles.langItemInfo}>
              <span className={styles.langItemName}>{l.name}</span>
              <span className={styles.langItemCount}>{(l.words || []).length} palavras</span>
            </div>
          </button>
        ))}

        {languages.length === 0 && !creatingLang && (
          <p className={styles.emptyHint}>Nenhuma língua ainda.<br />Crie a primeira!</p>
        )}
      </aside>

      <div className={styles.content}>
        {creatingLang && (
          <div className={styles.langView}>
            <div className={styles.langHeader}>
              <h2 className={styles.langName}>Nova Língua</h2>
            </div>
            <LangForm onSave={createLang} onCancel={() => setCreatingLang(false)} />
          </div>
        )}

        {!creatingLang && currentLang && (
          <LangView lang={currentLang} onUpdate={updateLang} onDelete={deleteLang} />
        )}

        {!creatingLang && !currentLang && (
          <div className={styles.placeholder}>
            <i className="ti ti-language" />
            <p>Selecione uma língua ou crie uma nova</p>
            <button className={styles.addWordBtn} onClick={() => setCreatingLang(true)}>
              <i className="ti ti-plus" /> Nova Língua
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
