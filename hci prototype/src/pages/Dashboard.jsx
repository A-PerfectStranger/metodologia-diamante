import { useState, useEffect, useCallback } from 'react'
import { useApp, SCREENS } from '../context/AppContext'
import {
  StatusBar, SectionLabel, Tag, Avatar, Annotation,
  WalletIcon, SendIcon, ClockIcon, ArrowRightIcon, CreditCardIcon,
  GlobeIcon, ChartIcon, ShieldIcon, EyeIcon, EyeOffIcon,
} from '../components/shared'

const COMMISSION = 4.50
const BASE_RATE = 0.9218

const CURRENCY_OPTIONS = [
  { label: 'EUR', rate: 0.9218, flag: '🇪🇸' },
  { label: 'MXN', rate: 18.45, flag: '🇲🇽' },
  { label: 'COP', rate: 4250.0, flag: '🇨🇴' },
  { label: 'GBP', rate: 0.7842, flag: '🇬🇧' },
]

const STATUS_LABELS = ['Iniciada', 'En proceso', 'En tránsito', 'Recibida']
const STATUS_COLORS = [
  'bg-brand-success', 'bg-brand-success', 'bg-white', 'bg-white/30'
]

function formatCurrency(val, symbol = '$', decimals = 2) {
  return `${symbol}${Number(val).toFixed(decimals)}`
}

// ── Calculator Widget ──────────────────────────────────────
function Calculator({ onStartTransfer }) {
  const [amount, setAmount] = useState('250')
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0])
  const [rate, setRate] = useState(currency.rate)
  const [lastUpdate, setLastUpdate] = useState(0)

  // Simulate rate micro-fluctuation every 12s
  useEffect(() => {
    const id = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.002
      setRate(prev => {
        const next = parseFloat((prev + fluctuation * prev).toFixed(4))
        return next
      })
      setLastUpdate(s => s + 12)
    }, 12000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setRate(currency.rate)
    setLastUpdate(0)
  }, [currency])

  const num = parseFloat(amount) || 0
  const received = num > 0 ? ((num - COMMISSION) * rate).toFixed(2) : '0.00'
  const total = (num + COMMISSION).toFixed(2)

  return (
    <div className="bg-pichincha rounded-2xl p-4 mb-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-xs text-white/70 font-medium">
          <WalletIcon className="w-3.5 h-3.5" />
          <p>Calculadora de transferencia</p>
        </div>
        <select
          value={currency.label}
          onChange={e => setCurrency(CURRENCY_OPTIONS.find(c => c.label === e.target.value))}
          className="bg-white/15 text-white text-xs font-bold border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
        >
          {CURRENCY_OPTIONS.map(c => (
            <option key={c.label} value={c.label} className="text-gray-800">
              {c.flag} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 items-end mb-3">
        <div className="flex-1">
          <p className="text-[11px] text-white/60 mb-1">Envías (USD)</p>
          <div className="bg-white/15 rounded-lg px-3 py-2.5 flex items-center gap-1">
            <span className="text-white/70 text-base">$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
              step="10"
              className="bg-transparent text-white text-xl font-extrabold w-full outline-none min-w-0"
              placeholder="0"
            />
          </div>
        </div>
        <span className="text-white/50 text-xl pb-2">→</span>
        <div className="flex-1">
          <p className="text-[11px] text-white/60 mb-1">Recibe ({currency.label})</p>
          <div className="bg-white/20 rounded-lg px-3 py-2.5">
            <p className="text-white text-xl font-extrabold">
              {currency.label === 'EUR' ? '€' : currency.label === 'GBP' ? '£' : '$'}
              {received}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-white/60 mb-3">
        <span>Comisión: {formatCurrency(COMMISSION)}</span>
        <span>TC: {rate.toFixed(4)}</span>
        <span>Total: {formatCurrency(total)}</span>
      </div>

      {lastUpdate > 0 && (
        <div className="flex items-center gap-1.5 text-[10px] text-white/50 mb-2">
          <ClockIcon className="w-3 h-3" />
          <p>TC actualizado hace {lastUpdate}s</p>
        </div>
      )}

      <button
        onClick={onStartTransfer}
        className="w-full bg-white/20 hover:bg-white/30 active:scale-[0.98] transition-all text-white text-sm font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2"
      >
        <span>Iniciar transferencia</span>
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Transfer Status Widget ─────────────────────────────────
function TransferWidget({ transfer, onViewDetail }) {
  const step = transfer.status // 0..3
  return (
    <div
      onClick={onViewDetail}
      className="card-gradient card-premium card-shadow card-hover rounded-3xl p-4 mb-3 cursor-pointer active:scale-[0.99] transition-transform text-white"
    >
      <div className="flex items-center gap-1.5 text-[11px] text-white/70 mb-2">
        <SendIcon className="w-3.5 h-3.5" />
        <p>Transferencia en curso</p>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-sm font-bold text-white">
            ${transfer.amount} USD → {transfer.country}
          </p>
          <p className="text-xs text-white/70 mt-0.5">{transfer.recipient} · Hace 2h</p>
        </div>
        <span className="glass bg-white/20 rounded-full px-3 py-1 text-xs font-bold text-white">
          {STATUS_LABELS[step]}
        </span>
      </div>

      {/* Mini tracker */}
      <div className="flex items-center gap-1 mb-1.5">
        {STATUS_LABELS.map((_, i) => (
          <div key={i} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              i < step ? 'bg-brand-success text-white' :
              i === step ? 'bg-white text-pichincha' :
              'bg-white/25 text-white/60'
            }`}>
              {i < step ? '✓' : i === step ? '●' : '○'}
            </div>
            {i < STATUS_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-brand-success' : 'bg-white/25'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-[10px] text-white/60">
        {STATUS_LABELS.map((l, i) => (
          <span key={i} className={i === step ? 'text-white font-bold' : ''}>{l}</span>
        ))}
      </div>
      <p className="text-center text-[11px] text-white/60 mt-2">Ver detalle →</p>
    </div>
  )
}

// ── Quick Actions ──────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: CreditCardIcon, label: 'Nueva tarjeta', screen: SCREENS.CREATE_CARD },
  { icon: GlobeIcon, label: 'Transferir', screen: SCREENS.TRANSFER_CONFIRM },
  { icon: ChartIcon, label: 'Envíos', screen: SCREENS.TRANSFER_TRACKER },
  { icon: ShieldIcon, label: 'Mis tarjetas', screen: SCREENS.CARDS_PANEL },
]

// ── Dashboard Page ─────────────────────────────────────────
export default function Dashboard() {
  const { navigate, transfer } = useApp()
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar />

      {/* Header */}
      <div className="bg-pichincha px-4 pt-3 pb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-white/60">Bienvenido</p>
            <p className="text-sm font-bold text-white">Dorian Albán</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm">
            DJ
          </div>
        </div>
        {/* Balance card */}
        <div className="bg-white/10 rounded-2xl px-4 py-4">
          <p className="text-xs text-white/60 mb-1">Saldo disponible</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-extrabold text-white">
              {showBalance ? '$3,450.00' : '••••••'}
            </p>
            <button onClick={() => setShowBalance(s => !s)} className="text-white/50 text-lg">
              {showBalance ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-white/50 mt-1">Cuenta corriente · •••• 4821</p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-1">

        {/* Active transfer widget */}
        {transfer.status < 3 && (
          <TransferWidget
            transfer={transfer}
            onViewDetail={() => navigate(SCREENS.TRANSFER_TRACKER)}
          />
        )}

        {/* Calculator */}
        <Calculator onStartTransfer={() => navigate(SCREENS.TRANSFER_CONFIRM)} />

        {/* Quick actions */}
        <SectionLabel>Acciones rápidas</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {QUICK_ACTIONS.map(({ icon: Icon, label, screen }) => (
            <button
              key={screen}
              onClick={() => navigate(screen)}
              className="bg-pichincha/5 border border-pichincha/10 rounded-xl p-3 text-center active:bg-pichincha/10 transition-colors"
            >
              <div className="flex justify-center mb-1 text-pichincha">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-pichincha">{label}</p>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <SectionLabel>Última actividad</SectionLabel>
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm mb-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Transferencia · España</p>
            <Tag color="orange">En tránsito</Tag>
          </div>
          <p className="text-xs text-gray-500 mt-1">$200 USD · Hace 2 horas</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Tarjeta virtual · Netflix</p>
            <Tag color="red">Límite alcanzado</Tag>
          </div>
          <p className="text-xs text-gray-500 mt-1">$14.99 USD · Ayer</p>
        </div>

      </div>
    </div>
  )
}
