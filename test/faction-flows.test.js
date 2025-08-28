/*
Pseudo-código para testes de integração do fluxo de Factions

**Setup:**
- Antes de cada teste, garantir que o estado `projectData.factions` esteja limpo (array vazio).
- Mockar as funções `saveProject`, `openModal`, e `closeModal` para espionar suas chamadas sem executar a lógica real de UI.

**Cenário 1: Criação de uma nova facção**

1.  **Teste: "Deve abrir o modal de facção em modo de criação"**
    - Chamar `openFactionModal(triggerElement)` sem um `data-faction-id`.
    - Verificar se `openModal` foi chamado com o argumento 'factionModal'.
    - Verificar se o título do modal é "Nova Facção".
    - Verificar se os campos (factionName, factionDescription, factionTags) estão vazios.
    - Verificar se `editingIds.faction` é `null`.

2.  **Teste: "Deve salvar uma nova facção com sucesso"**
    - Simular o preenchimento dos campos no modal:
        - `factionName.value = 'A Ordem da Fênix'`
        - `factionDescription.value = 'Sociedade secreta contra Lord Voldemort'`
        - `factionTags.value = 'bem, secreta'`
    - Chamar a função `saveFaction()`.
    - Verificar se `projectData.factions` agora contém 1 item.
    - Verificar se o novo item tem os dados corretos (nome, descrição, e um array de tags ['bem', 'secreta']).
    - Verificar se o novo item tem um `id` numérico.
    - Verificar se `saveProject()` foi chamado.
    - Verificar se `renderFactionList()` foi chamado.
    - Verificar se `closeModal` foi chamado com 'factionModal'.

3.  **Teste: "Não deve salvar se o nome da facção estiver vazio"**
    - Deixar `factionName.value` em branco.
    - Chamar `saveFaction()`.
    - Verificar se `projectData.factions` ainda está vazio.
    - Verificar se `saveProject()` NÃO foi chamado.
    - Verificar se o campo `factionName` recebeu uma classe de erro (ex: 'is-invalid').
    - Verificar se `closeModal` NÃO foi chamado.

**Cenário 2: Edição de uma facção existente**

1.  **Teste: "Deve abrir o modal e carregar os dados da facção para edição"**
    - Adicionar uma facção de teste a `projectData.factions`, ex: `{ id: 123, name: 'Comensais da Morte', description: 'Seguidores de Voldemort', tags: ['mal'] }`.
    - Criar um elemento de gatilho (trigger) com `dataset.factionId = '123'`.
    - Chamar `openFactionModal(trigger)`.
    - Verificar se `openModal` foi chamado com 'factionModal'.
    - Verificar se o título do modal é "Editar Facção".
    - Verificar se `editingIds.faction` está definido como `123`.
    - Verificar se os campos do formulário foram preenchidos com os dados da facção.

2.  **Teste: "Deve salvar as alterações de uma facção existente"**
    - Simular a alteração dos campos:
        - `factionName.value = 'Comensais da Morte (Renomeado)'`
    - Chamar `saveFaction()`.
    - Verificar se `projectData.factions` ainda tem 1 item.
    - Verificar se o item com `id: 123` foi atualizado com o novo nome.
    - Verificar se `saveProject()` foi chamado.
    - Verificar se `renderFactionList()` foi chamado.
    - Verificar se `closeModal` foi chamado.

**Cenário 3: Cancelamento**

1.  **Teste: "Deve fechar o modal ao clicar em Cancelar"**
    - O botão "Cancelar" no HTML já possui `data-action="closeModal" data-arg="factionModal"`.
    - Simular o clique no botão Cancelar.
    - Verificar se `closeModal` foi chamado com 'factionModal'.
    - (Este é mais um teste da infraestrutura do `main.js`, mas confirma a integração).

**Cenário 4: Exclusão**

1. **Teste: "Deve excluir uma facção"**
    - Adicionar uma facção de teste a `projectData.factions` com `id: 456`.
    - Chamar `deleteFaction(456)`.
    - Verificar se `projectData.factions` está agora vazio.
    - Verificar se `saveProject()` foi chamado.
    - Verificar se `renderFactionList()` foi chamado.
*/
