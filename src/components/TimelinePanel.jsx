import React, { useState } from 'react'
import styles from './TimelinePanel.module.css'

const filters = ['Toda a Era', 'Era Atual', 'Prólogo', 'Ato I']

export default function TimelinePanel({ events, onAdd }) {
  const [activeFilter, setActiveFilter] = useState('Era Atual')

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>
          <i className="ti ti-timeline" aria-hidden="true" style={{ color: 'var(--gold)' }} />
          Linha do Tempo
        </h2>
        <button className={styles.addBtn} onClick={onAdd}>
          <i className="ti ti-plus" aria-hidden="true" /> Evento
        </button>
      </div>

      <div className={styles.filters}>
        {filters.map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.timeline}>
        {events.map(ev => (
          <div key={ev.id} className={`${styles.event} ${ev.major ? styles.major : ''} ${ev.dim ? styles.dim : ''}`}>
            <div className={styles.date}>{ev.date}</div>
            <div className={styles.title}>{ev.title}</div>
            <div className={styles.desc}>{ev.description}</div>
            {ev.tags?.length > 0 && (
              <div className={styles.tags}>
                {ev.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
