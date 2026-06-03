import React from 'react'
import styles from './Sidebar.module.css'

const sections = [
  { section: 'Escrita',  ids: ['editor'] },
  { section: 'Mundo',    ids: ['characters', 'races', 'places', 'objects', 'grimoire', 'dictionary', 'timeline'] },
  { section: 'Projeto',  ids: ['stats', 'settings'] },
]

const badgeKeys = { characters: 'characters', places: 'places', objects: 'objects' }

export default function Sidebar({ activePanel, onSwitch, counts, genre }) {
  const nav = genre.nav
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <i className={`ti ${genre.icon}`} aria-hidden="true" />
        </div>
        <div>
          <div className={styles.appName}>LoreLoom</div>
          <div className={styles.appTagline}>{genre.label}</div>
        </div>
      </div>

      {sections.map(({ section, ids }) => (
        <div key={section} className={styles.section}>
          <div className={styles.sectionLabel}>{section}</div>
          {ids.map((id) => {
            const item = nav[id]
            if (!item) return null
            const badgeKey = badgeKeys[id]
            return (
              <button
                key={id}
                className={`${styles.item} ${activePanel === id ? styles.active : ''}`}
                onClick={() => onSwitch(id)}
              >
                <i className={`ti ${item.icon}`} aria-hidden="true" />
                {item.label}
                {badgeKey && counts[badgeKey] !== undefined && (
                  <span className={styles.badge}>{counts[badgeKey]}</span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
