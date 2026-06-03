import React, { useState, useEffect } from 'react'
import { GENRES } from './genres'
import GenreSelect from './components/GenreSelect'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import EditorPanel from './components/EditorPanel'
import WorldPanel from './components/WorldPanel'
import TimelinePanel from './components/TimelinePanel'
import StatsPanel from './components/StatsPanel'
import DictionaryPanel from './components/DictionaryPanel'
import FinancialPanel from './components/FinancialPanel'
import RacesPanel from './components/RacesPanel'
import Modal from './components/Modal'
import {
  initialChapters,
  initialDrafts,
  initialCharacters,
  initialPlaces,
  initialObjects,
  initialEvents,
} from './data/seed'
import appStyles from './App.module.css'

function applyTheme(genreId) {
  const theme = GENRES[genreId]?.theme
  if (!theme) return
  const root = document.documentElement
  Object.entries(theme).forEach(([key, val]) => root.style.setProperty(key, val))
}

export default function App() {
  const [genreId, setGenreId] = useState(() => localStorage.getItem('ll_genre') || null)
  const [panel, setPanel] = useState('editor')
  const [modal, setModal] = useState(null)

  const [chapters, setChapters] = useState(initialChapters)
  const [drafts, setDrafts] = useState(initialDrafts)
  const [characters, setCharacters] = useState(initialCharacters)
  const [places, setPlaces] = useState(initialPlaces)
  const [objects, setObjects] = useState(initialObjects)
  const [events, setEvents] = useState(initialEvents)

  useEffect(() => {
    if (genreId) applyTheme(genreId)
  }, [genreId])

  const handleSelectGenre = (id) => {
    localStorage.setItem('ll_genre', id)
    setGenreId(id)
  }

  const handleModalConfirm = (form) => {
    const id = Date.now()
    if (modal === 'chapter')   setChapters(c => [...c, { id, num: `CAP. ${c.length}`, title: form.title || 'Sem título', words: 0, target: 1500, content: '' }])
    if (modal === 'character') setCharacters(c => [...c, { id, ...form }])
    if (modal === 'place')     setPlaces(c => [...c, { id, ...form }])
    if (modal === 'object')    setObjects(c => [...c, { id, ...form }])
    if (modal === 'event')     setEvents(c => [...c, { id, ...form, tags: [] }])
    if (modal === 'draft')     setDrafts(c => [...c, { id, title: form.title || 'Rascunho' }])
    setModal(null)
  }

  if (!genreId) return <GenreSelect onSelect={handleSelectGenre} />

  const genre = GENRES[genreId]
  const counts = { characters: characters.length, places: places.length, objects: objects.length }

  return (
    <div className={appStyles.app}>
      <Sidebar activePanel={panel} onSwitch={setPanel} counts={counts} genre={genre} />
      <div className={appStyles.main}>
        <Topbar activePanel={panel} genre={genre} onChangeGenre={() => { localStorage.removeItem('ll_genre'); setGenreId(null) }} />

        {panel === 'editor' && (
          <EditorPanel
            chapters={chapters}
            drafts={drafts}
            onAddChapter={() => setModal('chapter')}
            onAddDraft={() => setModal('draft')}
          />
        )}
        {panel === 'characters' && (
          <WorldPanel type="characters" items={characters} onAdd={() => setModal('character')} />
        )}
        {panel === 'places' && (
          <WorldPanel type="places" items={places} onAdd={() => setModal('place')} />
        )}
        {panel === 'objects' && (
          <WorldPanel type="objects" items={objects} onAdd={() => setModal('object')} />
        )}
        {panel === 'timeline' && (
          <TimelinePanel events={events} onAdd={() => setModal('event')} />
        )}
        {panel === 'stats' && (
          <StatsPanel chapters={chapters} characters={characters} places={places} objects={objects} drafts={drafts} />
        )}
        {panel === 'dictionary' && <DictionaryPanel />}
        {panel === 'finance'    && <FinancialPanel />}
        {panel === 'races' && <RacesPanel genre={genre} />}
        {(panel === 'grimoire' || panel === 'settings') && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: "'Cinzel', serif", fontSize: 13 }}>
            Em breve...
          </div>
        )}
      </div>

      {modal && (
        <Modal
          type={modal === 'draft' ? 'chapter' : modal}
          onClose={() => setModal(null)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  )
}
