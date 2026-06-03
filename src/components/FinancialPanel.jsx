import React, { useState } from 'react'
import styles from './FinancialPanel.module.css'

const MARKET_CATEGORIES = ['Alimentação', 'Armas', 'Armaduras', 'Vestuário', 'Serviços', 'Hospedagem', 'Transporte', 'Magia', 'Outros']

/* ── Helpers ── */
function convert(amount, fromCurrency, toCurrency) {
  if (!fromCurrency || !toCurrency || fromCurrency.id === toCurrency.id) return amount
  return (amount * fromCurrency.baseValue) / toCurrency.baseValue
}

function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return '—'
  const fixed = n % 1 === 0 ? n : parseFloat(n.toFixed(4))
  return fixed.toLocaleString('pt-BR')
}

/* ── Currency form ── */
function CurrencyForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', symbol: '', description: '', baseValue: 1 })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className={styles.formCard}>
      <div className={styles.formGrid}>
        <div className={`${styles.fg} ${styles.full}`}>
          <label>Nome da Moeda</label>
          <input placeholder="ex: Ouro, Crédito Galáctico…" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
        </div>
        <div className={styles.fg}>
          <label>Símbolo</label>
          <input placeholder="ex: ◉ ₡ ¤" value={form.symbol} onChange={e => set('symbol', e.target.value)} />
        </div>
        <div className={styles.fg}>
          <label>Valor Base</label>
          <input type="number" min="0.0001" step="any" placeholder="1" value={form.baseValue} onChange={e => set('baseValue', parseFloat(e.target.value) || 1)} />
        </div>
        <div className={`${styles.fg} ${styles.full}`}>
          <label>Descrição</label>
          <input placeholder="Quem a emite? De que é feita?" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
      </div>
      <p className={styles.baseHint}>O Valor Base é relativo — ex: Cobre=1, Prata=10, Ouro=100.</p>
      <div className={styles.formActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
        <button className={styles.saveBtn} disabled={!form.name.trim()} onClick={() => form.name.trim() && onSave(form)}>Salvar</button>
      </div>
    </div>
  )
}

/* ── Moedas tab ── */
function MoedasTab({ currencies, onAdd, onUpdate, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [calcFrom, setCalcFrom] = useState('')
  const [calcAmt, setCalcAmt] = useState(1)

  const fromCur = currencies.find(c => c.id === calcFrom) || currencies[0]

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Moedas</span>
        <button className={styles.addBtn} onClick={() => { setAdding(true); setEditing(null) }}>
          <i className="ti ti-plus" /> Nova Moeda
        </button>
      </div>

      {adding && (
        <CurrencyForm
          onSave={f => { onAdd(f); setAdding(false) }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className={styles.currencyGrid}>
        {currencies.map(c => (
          editing?.id === c.id ? (
            <CurrencyForm
              key={c.id}
              initial={c}
              onSave={f => { onUpdate({ ...c, ...f }); setEditing(null) }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div key={c.id} className={styles.currencyCard}>
              <div className={styles.currencySymbol}>{c.symbol || '¤'}</div>
              <div className={styles.currencyInfo}>
                <div className={styles.currencyName}>{c.name}</div>
                {c.description && <div className={styles.currencyDesc}>{c.description}</div>}
                <div className={styles.currencyBase}>Valor base: <strong>{c.baseValue}</strong></div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.iconBtn} onClick={() => setEditing(c)} title="Editar"><i className="ti ti-pencil" /></button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(c.id)} title="Excluir"><i className="ti ti-trash" /></button>
              </div>
            </div>
          )
        ))}
        {currencies.length === 0 && !adding && (
          <p className={styles.emptyHint}>Nenhuma moeda criada ainda.</p>
        )}
      </div>

      {currencies.length >= 2 && (
        <div className={styles.calculator}>
          <div className={styles.calcTitle}><i className="ti ti-calculator" /> Calculadora de Câmbio</div>
          <div className={styles.calcRow}>
            <input
              type="number"
              className={styles.calcInput}
              value={calcAmt}
              min="0"
              step="any"
              onChange={e => setCalcAmt(parseFloat(e.target.value) || 0)}
            />
            <select className={styles.calcSelect} value={calcFrom} onChange={e => setCalcFrom(e.target.value)}>
              {currencies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <span className={styles.calcEquals}>=</span>
          </div>
          <div className={styles.calcResults}>
            {currencies.filter(c => c.id !== fromCur?.id).map(c => (
              <div key={c.id} className={styles.calcResult}>
                <span className={styles.calcResultSymbol}>{c.symbol || '¤'}</span>
                <span className={styles.calcResultAmt}>{fmt(convert(calcAmt, fromCur, c))}</span>
                <span className={styles.calcResultName}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Câmbio tab ── */
function CambioTab({ currencies }) {
  if (currencies.length < 2) {
    return <div className={styles.emptyState}><i className="ti ti-arrows-exchange" /><p>Crie pelo menos 2 moedas para ver a tabela de câmbio.</p></div>
  }
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Tabela de Câmbio</span>
        <span className={styles.sectionHint}>1 unidade de → equivale a ↓</span>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.cambioTable}>
          <thead>
            <tr>
              <th className={styles.cornerCell}></th>
              {currencies.map(c => (
                <th key={c.id}><span className={styles.thSymbol}>{c.symbol || '¤'}</span> {c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currencies.map(from => (
              <tr key={from.id}>
                <td className={styles.rowHeader}><span>{from.symbol || '¤'}</span> {from.name}</td>
                {currencies.map(to => (
                  <td key={to.id} className={from.id === to.id ? styles.diagCell : styles.rateCell}>
                    {from.id === to.id ? '—' : fmt(convert(1, from, to))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Mercado tab ── */
function MercadoTab({ currencies, items, onAddItem, onUpdateItem, onDeleteItem }) {
  const [filterCat, setFilterCat] = useState('Todos')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = items.filter(i => filterCat === 'Todos' || i.category === filterCat)

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Lista de Preços</span>
        <button className={styles.addBtn} onClick={() => { setAdding(true); setEditing(null) }}>
          <i className="ti ti-plus" /> Novo Item
        </button>
      </div>

      <div className={styles.catFilters}>
        {['Todos', ...MARKET_CATEGORIES].map(cat => (
          <button key={cat} className={`${styles.filterBtn} ${filterCat === cat ? styles.filterActive : ''}`} onClick={() => setFilterCat(cat)}>{cat}</button>
        ))}
      </div>

      {(adding || editing) && (
        <PriceItemForm
          key={editing?.id || 'new'}
          initial={editing}
          currencies={currencies}
          onSave={f => {
            if (editing) { onUpdateItem({ ...editing, ...f }); setEditing(null) }
            else { onAddItem(f); setAdding(false) }
          }}
          onCancel={() => { setAdding(false); setEditing(null) }}
        />
      )}

      <div className={styles.tableWrap}>
        <table className={styles.marketTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Descrição</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const cur = currencies.find(c => c.id === item.currencyId)
              return (
                <tr key={item.id} className={styles.marketRow}>
                  <td className={styles.itemName}>{item.name}</td>
                  <td><span className={styles.catTag}>{item.category}</span></td>
                  <td className={styles.itemPrice}>
                    {cur ? `${cur.symbol || '¤'} ${fmt(item.price)} ${cur.name}` : `${fmt(item.price)}`}
                  </td>
                  <td className={styles.itemDesc}>{item.description || <span className={styles.muted}>—</span>}</td>
                  <td className={styles.itemActions}>
                    <button className={styles.iconBtn} onClick={() => { setEditing(item); setAdding(false) }} title="Editar"><i className="ti ti-pencil" /></button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDeleteItem(item.id)} title="Excluir"><i className="ti ti-trash" /></button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className={styles.emptyRow}>Nenhum item nesta categoria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PriceItemForm({ initial, currencies, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', category: 'Alimentação', price: '', currencyId: currencies[0]?.id || '', description: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={styles.formCard}>
      <div className={styles.formGrid}>
        <div className={`${styles.fg} ${styles.full}`}>
          <label>Nome do Item</label>
          <input placeholder="ex: Pão de centeio, Espada longa…" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
        </div>
        <div className={styles.fg}>
          <label>Categoria</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {MARKET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.fg}>
          <label>Preço</label>
          <input type="number" min="0" step="any" placeholder="0" value={form.price} onChange={e => set('price', parseFloat(e.target.value) || '')} />
        </div>
        <div className={styles.fg}>
          <label>Moeda</label>
          <select value={form.currencyId} onChange={e => set('currencyId', e.target.value)}>
            {currencies.map(c => <option key={c.id} value={c.id}>{c.symbol} {c.name}</option>)}
            {currencies.length === 0 && <option value="">Sem moedas</option>}
          </select>
        </div>
        <div className={`${styles.fg} ${styles.full}`}>
          <label>Descrição</label>
          <input placeholder="Contexto adicional sobre o preço…" value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
      </div>
      <div className={styles.formActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
        <button className={styles.saveBtn} disabled={!form.name.trim()} onClick={() => form.name.trim() && onSave(form)}>Salvar</button>
      </div>
    </div>
  )
}

/* ── Main panel ── */
const TABS = [
  { id: 'moedas',  label: 'Moedas',   icon: 'ti-coins' },
  { id: 'cambio',  label: 'Câmbio',   icon: 'ti-arrows-exchange' },
  { id: 'mercado', label: 'Mercado',  icon: 'ti-shopping-bag' },
]

export default function FinancialPanel() {
  const [tab, setTab] = useState('moedas')
  const [currencies, setCurrencies] = useState([])
  const [items, setItems] = useState([])

  const addCurrency    = f  => setCurrencies(cs => [...cs, { id: Date.now(), ...f }])
  const updateCurrency = c  => setCurrencies(cs => cs.map(x => x.id === c.id ? c : x))
  const deleteCurrency = id => setCurrencies(cs => cs.filter(x => x.id !== id))

  const addItem    = f  => setItems(is => [...is, { id: Date.now(), ...f }])
  const updateItem = it => setItems(is => is.map(x => x.id === it.id ? it : x))
  const deleteItem = id => setItems(is => is.filter(x => x.id !== id))

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`} onClick={() => setTab(t.id)}>
            <i className={`ti ${t.icon}`} />
            {t.label}
          </button>
        ))}
        <div className={styles.tabSpacer} />
        <span className={styles.tabMeta}>{currencies.length} moeda{currencies.length !== 1 ? 's' : ''} · {items.length} ite{items.length !== 1 ? 'ns' : 'm'}</span>
      </div>

      <div className={styles.body}>
        {tab === 'moedas'  && <MoedasTab  currencies={currencies} onAdd={addCurrency} onUpdate={updateCurrency} onDelete={deleteCurrency} />}
        {tab === 'cambio'  && <CambioTab  currencies={currencies} />}
        {tab === 'mercado' && <MercadoTab currencies={currencies} items={items} onAddItem={addItem} onUpdateItem={updateItem} onDeleteItem={deleteItem} />}
      </div>
    </div>
  )
}
