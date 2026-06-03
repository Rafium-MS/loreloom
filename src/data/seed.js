export const initialChapters = [
  { id: 1, num: 'PRÓLOGO', title: 'O Chamado das Runas', words: 680, target: 1000, content: `O vento uivava entre as torres de pedra negra quando Serafael sentiu o primeiro pulso das runas. Não era uma dor exatamente — mais uma pressão atrás dos olhos, quente e insistente, como se o próprio mundo tentasse sussurrar um segredo que há muito havia esquecido de contar.\n\nEle parou no centro do pátio, a mão instintivamente indo à empunhadura da espada que já não carregava. Hábito antigo. Hábito de sobrevivente.\n\n— Você as ouve, não é? — disse uma voz a seus costas.\n\nSerafael se virou devagar. A mulher usava mantos de tecido que mudavam de cor à luz das tochas, e seus olhos — dois fragmentos de âmbar fossilizado — pareciam enxergar através da pedra e do tempo.\n\n— Depende do que está me pedindo para confirmar — respondeu ele, cuidadoso como sempre com as palavras.\n\nEla sorriu. Era o tipo de sorriso que não prometia nada de bom.\n\n— As Runas do Véu estão acordando. E você, soldado sem exército, foi escolhido como seu guardião.` },
  { id: 2, num: 'CAP. I', title: 'A Forja de Lyranith', words: 1240, target: 1500, content: 'O conteúdo do Capítulo I será escrito aqui...' },
  { id: 3, num: 'CAP. II', title: 'O Navio Estelar', words: 980, target: 1500, content: 'O conteúdo do Capítulo II será escrito aqui...' },
  { id: 4, num: 'CAP. III', title: 'Sombras no Nexo', words: 1560, target: 2000, content: 'O conteúdo do Capítulo III será escrito aqui...' },
  { id: 5, num: 'CAP. IV', title: 'O Pacto Proibido', words: 740, target: 1500, content: 'O conteúdo do Capítulo IV será escrito aqui...' },
]

export const initialDrafts = [
  { id: 1, title: 'Cena do Portal' },
  { id: 2, title: 'Diálogo final' },
  { id: 3, title: 'Ideia — traição' },
]

export const initialCharacters = [
  { id: 1, name: 'Serafael Dawnguard', role: 'Protagonista', race: 'Humano', age: '34', occupation: 'Ex-soldado', description: 'Carrega o peso de batalhas esquecidas e um dom que teme usar.', arc: 'De soldado sem propósito a guardião das Runas do Véu.', relations: 'Aliado de Mira Solace', notes: '' },
  { id: 2, name: 'Vyrath, O Tecelão', role: 'Antagonista', race: 'Entidade', age: 'Desconhecida', occupation: 'Ser Primordial', description: 'Habita o espaço entre os véus da realidade. Deseja reunir as Runas.', arc: 'Antagonista principal desde o início.', relations: 'Inimigo de Serafael', notes: '' },
  { id: 3, name: 'Mira Solace', role: 'Coadjuvante', race: 'Élfica', age: '847', occupation: 'Arquimaga', description: 'Arquimaga do Conselho das Estrelas. Mentora de Serafael.', arc: 'Guia o protagonista enquanto esconde seus próprios segredos.', relations: 'Mentora de Serafael', notes: '' },
  { id: 4, name: 'Drek Ironfold', role: 'Coadjuvante', race: 'Anão', age: '203', occupation: 'Engenheiro-Mágico', description: 'Especialista em naves de dobramento espacial.', arc: 'Aliado técnico essencial na jornada.', relations: 'Aliado do grupo', notes: '' },
  { id: 5, name: 'A Oráculo', role: 'Misteriosa', race: 'Desconhecida', age: '???', occupation: 'Desconhecida', description: 'Identidade desconhecida. Guia eventos nos bastidores.', arc: 'Revelada gradualmente ao longo da narrativa.', relations: 'Desconhecidas', notes: '' },
]

export const initialPlaces = [
  { id: 1, name: 'Cidadela de Lyranith', type: 'Fortaleza', genre: 'Fantasia', description: 'Fortaleza flutuante. Sede do Conselho das Estrelas, localizada no ponto de convergência dos três véus.' },
  { id: 2, name: 'Nexo Estelar', type: 'Estação Espacial', genre: 'Sci-Fi', description: 'Estação espacial construída sobre a ruína de um deus morto. Principal porto do setor.' },
  { id: 3, name: 'Floresta do Silêncio Eterno', type: 'Floresta', genre: 'Fantasia', description: 'Floresta onde nenhum som existe. Habitada por ecos de batalhas antigas.' },
  { id: 4, name: 'O Véu', type: 'Dimensão', genre: 'Ambos', description: 'Dimensão entre dimensões. Espaço onde a magia e a tecnologia se tornam a mesma coisa.' },
]

export const initialObjects = [
  { id: 1, name: 'Runas do Véu', type: 'Artefato Mágico', description: 'Fragmentos de escritura cósmica. Cada runa controla um aspecto da realidade quando ativada.' },
  { id: 2, name: 'Lâmina Voidcutter', type: 'Arma', description: 'Espada forjada no núcleo de uma estrela moribunda. Corta através do espaço-tempo.' },
  { id: 3, name: 'Núcleo de Dobramento Mk-VII', type: 'Tecnologia', description: 'Motor de nave capaz de criar dobras na malha mágica do universo.' },
]

export const initialEvents = [
  { id: 1, date: 'ANO 0 — ERA DO VÉU', title: 'O Grande Silêncio', description: 'Os deuses antigos selaram o Véu pela primeira vez, separando o plano mágico do físico. Início da Era dos Mortais.', tags: ['Mitologia', 'Worldbuilding'], major: true },
  { id: 2, date: 'ANO 847 — FUNDAÇÃO', title: 'Construção da Cidadela de Lyranith', description: 'Os Magos Estelares erguem sua fortaleza no ponto de convergência dos três Véus. Mira Solace participa da fundação.', tags: ['Mira Solace', 'Lyranith'], major: false },
  { id: 3, date: 'ANO 1.203 — GUERRA', title: 'A Batalha das Runas Fragmentadas', description: 'Vyrath tenta reunir os fragmentos das Runas do Véu. A Guarda Estelar impede a reunificação ao custo de metade de seus membros.', tags: ['Vyrath', 'Guarda Estelar', 'Conflito'], major: false },
  { id: 4, date: 'ANO 1.237 — PRESENTE', title: 'Serafael ouve o chamado das Runas', description: 'Os eventos do romance começam. O protagonista é convocado pela Oráculo e inicia sua jornada como guardião das Runas.', tags: ['Início', 'Serafael', 'Cap. I'], major: true },
  { id: 5, date: 'ANO 1.237 — CAPÍTULO II', title: 'Chegada ao Nexo Estelar', description: 'Serafael e Mira viajam via dobramento mágico ao Nexo. Primeiro contato com a tecnologia do Véu.', tags: ['Serafael', 'Nexo', 'Cap. II'], major: false },
  { id: 6, date: 'FUTURO — PLANEJADO', title: '??? O Confronto Final', description: 'A reunificação das Runas decide o destino do Véu e de todos os planos de existência.', tags: ['Rascunho', 'Climax'], major: false, dim: true },
]
