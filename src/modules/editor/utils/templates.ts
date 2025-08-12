export const templates: Record<string, string> = {
  chapter: "\n\n═══ CAPÍTULO [NÚMERO] ═══\n[TÍTULO DO CAPÍTULO]\n\n",
  scene: "\n\n[NOVA CENA]\n\nDescrição do ambiente e atmosfera...\n\n",
  dialogue: "\n\n— Texto do diálogo — disse o personagem, com uma expressão pensativa.\n\n",
  action: "\n\n[Descrição da ação intensa e movimento dos personagens]\n\n",
};

export const templateOptions = [
  { key: 'chapter', label: 'Novo Capítulo' },
  { key: 'scene', label: 'Nova Cena' },
  { key: 'dialogue', label: 'Diálogo' },
  { key: 'action', label: 'Sequência de Ação' },
];