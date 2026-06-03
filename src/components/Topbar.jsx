import React from 'react'
import styles from './Topbar.module.css'

export default function Topbar({ activePanel, genre, onChangeGenre }) {
  const item = genre.nav[activePanel]
  const title = item ? item.label : 'LoreLoom'
  return (
    <header className={styles.topbar}>
      <span className={styles.title}>{title}</span>
      <button className={styles.btn}>
        <i className="ti ti-search" aria-hidden="true" /> Buscar
      </button>
      <button className={styles.btn}>
        <i className="ti ti-clock" aria-hidden="true" /> Histórico
      </button>
      <button className={styles.btn} onClick={onChangeGenre} title="Trocar gênero">
        <i className={`ti ${genre.icon}`} aria-hidden="true" /> {genre.label}
      </button>
      <button className={`${styles.btn} ${styles.primary}`}>
        <i className="ti ti-device-floppy" aria-hidden="true" /> Salvar
      </button>
    </header>
  )
}
