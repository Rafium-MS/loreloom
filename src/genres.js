export const GENRES = {
  fantasy: {
    id: 'fantasy',
    label: 'Fantasia',
    tagline: 'Forja seu mundo arcano',
    icon: 'ti-wand',
    nav: {
      editor:     { label: 'Editor',         icon: 'ti-feather' },
      characters: { label: 'Personagens',    icon: 'ti-users' },
      races:      { label: 'Raças',          icon: 'ti-shield-half' },
      places:     { label: 'Lugares',        icon: 'ti-map-pin' },
      objects:    { label: 'Objetos',        icon: 'ti-wand' },
      grimoire:   { label: 'Grimório',       icon: 'ti-book-2' },
      dictionary: { label: 'Dicionário',     icon: 'ti-language' },
      finance:    { label: 'Economia',       icon: 'ti-coins' },
      timeline:   { label: 'Linha do Tempo', icon: 'ti-timeline' },
      stats:      { label: 'Estatísticas',   icon: 'ti-chart-bar' },
      settings:   { label: 'Configurações',  icon: 'ti-settings' },
    },
    theme: {
      '--primary':        '#bf7b20',        /* âmbar queimado   */
      '--primary-light':  '#d9982a',        /* âmbar claro      */
      '--primary-dim':    'rgba(191,123,32,0.18)',
      '--primary-border': 'rgba(191,123,32,0.30)',
      '--accent':         '#2e6b30',        /* verde floresta   */
      '--accent-deep':    '#1a3d1c',        /* floresta escura  */
      '--accent-soft':    '#eaf3e8',        /* verde suave      */
      '--accent-mid':     '#4a8a4d',        /* verde médio      */
      '--sidebar-bg':     '#15100a',        /* terra escura     */
      '--sidebar-text':   '#c8b48a',        /* areia quente     */
      '--surface':        '#f7f3eb',        /* pergaminho       */
      '--surface-mid':    '#ede4d0',        /* pergaminho médio */
      '--surface-dark':   '#dfd3b8',        /* pergaminho escuro*/
      '--text-main':      '#28190a',        /* marrom escuro    */
      '--muted':          '#7a6040',        /* terra amuada     */
      '--border':         'rgba(120,90,40,0.18)',
    },
  },

  scifi: {
    id: 'scifi',
    label: 'Ficção Científica',
    tagline: 'Expande seu universo',
    icon: 'ti-rocket',
    nav: {
      editor:     { label: 'Editor',         icon: 'ti-feather' },
      characters: { label: 'Tripulação',     icon: 'ti-users' },
      races:      { label: 'Espécies',       icon: 'ti-dna' },
      places:     { label: 'Planetas',       icon: 'ti-planet' },
      objects:    { label: 'Equipamentos',   icon: 'ti-device-gamepad-2' },
      grimoire:   { label: 'Tecnologia',     icon: 'ti-cpu' },
      dictionary: { label: 'Dicionário',     icon: 'ti-language' },
      finance:    { label: 'Economia',       icon: 'ti-coins' },
      timeline:   { label: 'Cronologia',     icon: 'ti-timeline' },
      stats:      { label: 'Estatísticas',   icon: 'ti-chart-bar' },
      settings:   { label: 'Configurações',  icon: 'ti-settings' },
    },
    theme: {
      '--primary':        '#00b4d8',
      '--primary-light':  '#48cae4',
      '--primary-dim':    'rgba(0,180,216,0.18)',
      '--primary-border': 'rgba(0,180,216,0.28)',
      '--accent':         '#023e8a',
      '--accent-deep':    '#03045e',
      '--accent-soft':    '#e0f4ff',
      '--accent-mid':     '#0096c7',
      '--sidebar-bg':     '#05101f',
      '--sidebar-text':   '#90caf9',
      '--surface':        '#f0f7ff',
      '--surface-mid':    '#ddeeff',
      '--surface-dark':   '#c8e3fa',
      '--text-main':      '#030d1e',
      '--muted':          '#2a6fa8',
      '--border':         'rgba(0,100,180,0.18)',
    },
  },
}
