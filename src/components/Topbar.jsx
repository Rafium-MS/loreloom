import React from 'react'
import styles from './Topbar.module.css'

const titles = {
  editor: 'As Crônicas do Véu Eterno',
  characters: 'Personagens',
  places: 'Lugares',
  objects: 'Objetos & Artefatos',
  timeline: 'Linha do Tempo',
  stats: 'Estatísticas do Projeto',
  settings: 'Configurações',
}

export default function Topbar({ activePanel }) {
  return (
    <header className={styles.topbar}>
      <span className={styles.title}>{titles[activePanel] || 'LoreLoom'}</span>
      <button className={styles.btn}>
        <i className="ti ti-search" aria-hidden="true" /> Buscar
      </button>
      <button className={styles.btn}>
        <i className="ti ti-clock" aria-hidden="true" /> Histórico
      </button>
      <button className={`${styles.btn} ${styles.gold}`}>
        <i className="ti ti-device-floppy" aria-hidden="true" /> Salvar
      </button>
    </header>
  )
}
