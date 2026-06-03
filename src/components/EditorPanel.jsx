import React, { useState, useCallback } from 'react'
import styles from './EditorPanel.module.css'

export default function EditorPanel({ chapters, drafts, onAddChapter, onAddDraft }) {
  const [activeChapter, setActiveChapter] = useState(chapters[0] || null)
  const [content, setContent] = useState(chapters[0]?.content || '')

  const handleSelectChapter = useCallback((ch) => {
    setActiveChapter(ch)
    setContent(ch.content)
  }, [])

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const readingMins = Math.ceil(wordCount / 200)

  return (
    <div className={styles.layout}>
      {/* Chapters pane */}
      <aside className={styles.chaptersPane}>
        <div className={styles.paneHeader}>
          <span>Capítulos</span>
          <button className={styles.addBtn} onClick={onAddChapter} aria-label="Adicionar capítulo">
            <i className="ti ti-plus" aria-hidden="true" />
          </button>
        </div>

        <div className={styles.chapterList}>
          {chapters.map(ch => (
            <div
              key={ch.id}
              className={`${styles.chapterItem} ${activeChapter?.id === ch.id ? styles.active : ''}`}
              onClick={() => handleSelectChapter(ch)}
            >
              <div className={styles.chNum}>{ch.num}</div>
              <div className={styles.chTitle}>{ch.title}</div>
              <div className={styles.chWords}>{ch.words.toLocaleString('pt-BR')} palavras</div>
            </div>
          ))}
        </div>

        <div className={styles.draftsSection}>
          <div className={styles.draftsLabel}>Rascunhos</div>
          {drafts.map(d => (
            <div key={d.id} className={styles.draftItem}>
              <i className="ti ti-file-text" aria-hidden="true" />
              <span>{d.title}</span>
            </div>
          ))}
          <div className={styles.draftItem} onClick={onAddDraft} style={{ cursor: 'pointer' }}>
            <i className="ti ti-plus" aria-hidden="true" style={{ color: 'var(--gold)' }} />
            <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Novo rascunho</span>
          </div>
        </div>
      </aside>

      {/* Text editor */}
      <div className={styles.editorWrap}>
        <div className={styles.toolbar}>
          <button className={styles.tbBtn} style={{ fontWeight: 700 }}>N</button>
          <button className={styles.tbBtn} style={{ fontStyle: 'italic' }}>I</button>
          <button className={styles.tbBtn} style={{ textDecoration: 'underline' }}>S</button>
          <div className={styles.sep} />
          <button className={styles.tbBtn}><i className="ti ti-align-left" aria-hidden="true" /></button>
          <button className={styles.tbBtn}><i className="ti ti-align-center" aria-hidden="true" /></button>
          <button className={styles.tbBtn}><i className="ti ti-align-justified" aria-hidden="true" /></button>
          <div className={styles.sep} />
          <button className={styles.tbBtn}><i className="ti ti-list" aria-hidden="true" /></button>
          <button className={styles.tbBtn}><i className="ti ti-blockquote" aria-hidden="true" /></button>
          <div className={styles.sep} />
          <button className={styles.tbBtn}><i className="ti ti-arrow-back-up" aria-hidden="true" /></button>
          <button className={styles.tbBtn}><i className="ti ti-arrow-forward-up" aria-hidden="true" /></button>
          <div style={{ flex: 1 }} />
          <button className={styles.tbBtn} style={{ fontSize: 11, gap: 4 }}>
            <i className="ti ti-maximize" aria-hidden="true" /> Foco
          </button>
        </div>

        <input
          className={styles.chapterTitle}
          value={activeChapter?.title || ''}
          readOnly
          placeholder="Título do capítulo..."
        />

        <textarea
          className={styles.editor}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Comece a escrever sua história aqui..."
        />

        <div className={styles.wordcountBar}>
          <span><i className="ti ti-letter-case" aria-hidden="true" /> {wordCount.toLocaleString('pt-BR')} palavras</span>
          <span><i className="ti ti-clock" aria-hidden="true" /> ~{readingMins} min de leitura</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>
            {activeChapter ? `${activeChapter.num} — ${activeChapter.title}` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
