import React from 'react'
import { GENRES } from '../genres'
import styles from './GenreSelect.module.css'

export default function GenreSelect({ onSelect }) {
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <i className="ti ti-books" />
        </div>
        <h1 className={styles.title}>LoreLoom</h1>
        <p className={styles.sub}>Escolha o gênero do seu mundo</p>
      </div>

      <div className={styles.cards}>
        {Object.values(GENRES).map((genre) => (
          <button key={genre.id} className={styles.card} onClick={() => onSelect(genre.id)}>
            <i className={`ti ${genre.icon} ${styles.cardIcon}`} />
            <span className={styles.cardLabel}>{genre.label}</span>
            <span className={styles.cardTagline}>{genre.tagline}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
