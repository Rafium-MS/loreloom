import React from 'react'
import styles from './StatsPanel.module.css'

export default function StatsPanel({ chapters, characters, places, objects, drafts }) {
  const totalWords = chapters.reduce((s, c) => s + c.words, 0)
  const totalTarget = chapters.reduce((s, c) => s + c.target, 0)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>
          <i className="ti ti-chart-bar" aria-hidden="true" style={{ color: 'var(--gold)' }} />
          Estatísticas do Projeto
        </h2>
      </div>

      <div className={styles.statGrid}>
        <div className={`${styles.stat} ${styles.purple}`}>
          <div className={styles.statLabel}>Palavras</div>
          <div className={styles.statValue}>{totalWords.toLocaleString('pt-BR')}</div>
        </div>
        <div className={`${styles.stat} ${styles.blue}`}>
          <div className={styles.statLabel}>Capítulos</div>
          <div className={styles.statValue}>{chapters.length}</div>
        </div>
        <div className={`${styles.stat} ${styles.gold}`}>
          <div className={styles.statLabel}>Personagens</div>
          <div className={styles.statValue}>{characters.length}</div>
        </div>
        <div className={`${styles.stat} ${styles.purple}`}>
          <div className={styles.statLabel}>Rascunhos</div>
          <div className={styles.statValue}>{drafts.length}</div>
        </div>
        <div className={`${styles.stat} ${styles.blue}`}>
          <div className={styles.statLabel}>Lugares</div>
          <div className={styles.statValue}>{places.length}</div>
        </div>
        <div className={`${styles.stat} ${styles.gold}`}>
          <div className={styles.statLabel}>Objetos</div>
          <div className={styles.statValue}>{objects.length}</div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Progresso por Capítulo</div>
      <div className={styles.bars}>
        {chapters.map(ch => {
          const pct = Math.round(Math.min(100, (ch.words / ch.target) * 100))
          return (
            <div key={ch.id} className={styles.barRow}>
              <div className={styles.barMeta}>
                <span className={styles.barLabel}>{ch.num} — {ch.title}</span>
                <span className={styles.barCount}>{ch.words.toLocaleString('pt-BR')} / {ch.target.toLocaleString('pt-BR')}</span>
              </div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.sectionTitle} style={{ marginTop: 24 }}>Meta Geral</div>
      <div className={styles.barRow}>
        <div className={styles.barMeta}>
          <span className={styles.barLabel}>Total do Manuscrito</span>
          <span className={styles.barCount}>{totalWords.toLocaleString('pt-BR')} / {totalTarget.toLocaleString('pt-BR')}</span>
        </div>
        <div className={styles.barTrack}>
          <div className={styles.barFillGold} style={{ width: `${Math.round(Math.min(100, (totalWords / totalTarget) * 100))}%` }} />
        </div>
      </div>
    </div>
  )
}
