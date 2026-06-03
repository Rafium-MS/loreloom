import React from 'react'
import styles from './Sidebar.module.css'

const navItems = [
  { section: 'Escrita', items: [{ id: 'editor', icon: 'ti-feather', label: 'Editor' }] },
  {
    section: 'Mundo',
    items: [
      { id: 'characters', icon: 'ti-users', label: 'Personagens', badgeKey: 'characters' },
      { id: 'places', icon: 'ti-map-pin', label: 'Lugares', badgeKey: 'places' },
      { id: 'objects', icon: 'ti-wand', label: 'Objetos', badgeKey: 'objects' },
      { id: 'timeline', icon: 'ti-timeline', label: 'Linha do Tempo' },
    ],
  },
  {
    section: 'Projeto',
    items: [
      { id: 'stats', icon: 'ti-chart-bar', label: 'Estatísticas' },
      { id: 'settings', icon: 'ti-settings', label: 'Configurações' },
    ],
  },
]

export default function Sidebar({ activePanel, onSwitch, counts }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <i className="ti ti-books" aria-hidden="true" />
        </div>
        <div>
          <div className={styles.appName}>LoreLoom</div>
          <div className={styles.appTagline}>Story Forge</div>
        </div>
      </div>

      {navItems.map(({ section, items }) => (
        <div key={section} className={styles.section}>
          <div className={styles.sectionLabel}>{section}</div>
          {items.map(({ id, icon, label, badgeKey }) => (
            <button
              key={id}
              className={`${styles.item} ${activePanel === id ? styles.active : ''}`}
              onClick={() => onSwitch(id)}
            >
              <i className={`ti ${icon}`} aria-hidden="true" />
              {label}
              {badgeKey && counts[badgeKey] !== undefined && (
                <span className={styles.badge}>{counts[badgeKey]}</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </aside>
  )
}
