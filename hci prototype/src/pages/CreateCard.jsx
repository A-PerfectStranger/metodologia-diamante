import { useState } from 'react'
import { useApp, SCREENS } from '../context/AppContext'
import {
  StatusBar, AppHeader, Annotation, Divider, PrimaryBtn, SecondaryBtn, SectionLabel,
  RefreshIcon, CartIcon, SparklesIcon, PlaneIcon, PencilIcon, CalendarIcon, HashIcon,
  InfinityIcon, CheckIcon, CreditCardIcon,
} from '../components/shared'

const PURPOSES = [
  { id: 'subscription', label: 'Suscripción', icon: RefreshIcon, hint: 'Netflix, Spotify, Amazon Prime…' },
  { id: 'purchase', label: 'Compra única', icon: CartIcon, hint: 'Uso único y se cancela automáticamente.' },
  { id: 'trial', label: 'Prueba gratuita', icon: SparklesIcon, hint: 'Evita cobros inesperados al terminar.' },
  { id: 'travel', label: 'Viaje', icon: PlaneIcon, hint: 'Hoteles, aerolíneas, car rental.' },
  { id: 'custom', label: 'Personalizado', icon: PencilIcon, hint: 'Nombre y uso libre.' },
]

const PRESET_LIMITS = [
  { label: '$5', value: 5, tag: 'Básico' },
  { label: '$10', value: 10, tag: 'Estándar' },
  { label: '$15', value: 15, tag: 'Netflix' },
  { label: '$25', value: 25, tag: 'Holgado' },
  { label: '$50', value: 50, tag: 'Grande' },
  { label: '$100', value: 100, tag: 'Máximo' },
]

const EXPIRY_OPTIONS = [
  { id: 'single', label: 'Un solo uso', desc: 'Se cancela tras el primer cargo.', icon: 'single' },
  { id: 'date', label: 'Fecha fija', desc: 'Selecciona cuándo expira.', icon: CalendarIcon },
  { id: 'n-uses', label: 'N usos', desc: 'Define cuántas veces puede usarse.', icon: HashIcon },
  { id: 'manual', label: 'Sin expiración', desc: 'La controlas tú manualmente.', icon: InfinityIcon },
]

const STEP_LABELS = ['Propósito', 'Límite', 'Expiración', 'Confirmar']

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {STEP_LABELS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
              ${i < step ? 'bg-brand-success border-brand-success text-white' :
                i === step ? 'bg-pichincha border-pichincha text-white' :
                'border-gray-200 text-gray-300'}`}
            >
              {i < step ? <CheckIcon className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <p className={`text-[9px] mt-0.5 font-semibold w-14 text-center ${i === step ? 'text-pichincha' : i < step ? 'text-brand-success' : 'text-gray-300'}`}>
              {label}
            </p>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`h-0.5 w-6 mb-4 mx-0.5 transition-colors ${i < step ? 'bg-brand-success' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Purpose ─────────────────────────────────────────
function Step1({ data, setData, onNext }) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
      <SectionLabel>¿Para qué usarás esta tarjeta?</SectionLabel>
      <div className="space-y-2 mb-4">
        {PURPOSES.map(p => {
          const Icon = p.icon
          return (
            <button
              key={p.id}
              onClick={() => setData(d => ({ ...d, purpose: p.id, purposeLabel: p.label, purposeIcon: p.icon }))}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all active:scale-[0.99]
                ${data.purpose === p.id
                  ? 'border-pichincha bg-pichincha/5'
                  : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <span className="text-pichincha"><Icon className="w-5 h-5" /></span>
              <div>
                <p className="text-sm font-semibold">{p.label}</p>
                <p className="text-xs text-gray-500">{p.hint}</p>
              </div>
              {data.purpose === p.id && (
                <span className="ml-auto text-pichincha"><CheckIcon className="w-5 h-5" /></span>
              )}
            </button>
          )
        })}
      </div>

      {data.purpose === 'custom' && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1 font-semibold">Nombre de la tarjeta</p>
          <input
            type="text"
            value={data.customName || ''}
            onChange={e => setData(d => ({ ...d, customName: e.target.value, name: e.target.value }))}
            placeholder="Ej: Prueba Adobe"
            className="w-full border-2 border-gray-200 focus:border-pichincha outline-none rounded-xl px-3 py-2.5 text-sm transition-colors"
          />
        </div>
      )}

      <PrimaryBtn onClick={onNext} disabled={!data.purpose}>
        Siguiente: Límite →
      </PrimaryBtn>
    </div>
  )
}

// ── Step 2: Limit ───────────────────────────────────────────
function Step2({ data, setData, onNext, onBack }) {
  const [custom, setCustom] = useState('')

  const handlePreset = (val) => {
    setData(d => ({ ...d, limit: val }))
    setCustom('')
  }

  const handleCustom = (val) => {
    setCustom(val)
    const n = parseFloat(val)
    if (!isNaN(n) && n > 0) setData(d => ({ ...d, limit: n }))
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
      <SectionLabel>¿Cuánto puede gastar esta tarjeta?</SectionLabel>

      <div className="bg-gray-50 border-2 border-pichincha rounded-xl p-4 mb-4 text-center">
        <p className="text-4xl font-extrabold text-pichincha">${data.limit?.toFixed(2) || '0.00'}</p>
        <p className="text-xs text-gray-500 mt-1">USD · Límite máximo</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {PRESET_LIMITS.map(p => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className={`py-2.5 rounded-xl text-center border-2 transition-all active:scale-[0.97]
              ${data.limit === p.value && !custom
                ? 'bg-pichincha border-pichincha text-white'
                : 'bg-gray-50 border-gray-100 hover:border-pichincha/30'}`}
          >
            <p className="text-sm font-bold">{p.label}</p>
            <p className={`text-[10px] ${data.limit === p.value && !custom ? 'text-white/70' : 'text-gray-400'}`}>{p.tag}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-1 font-semibold">O ingresa un monto personalizado</p>
      <div className="flex items-center border-2 border-gray-200 focus-within:border-pichincha rounded-xl px-3 py-2.5 mb-4 transition-colors">
        <span className="text-gray-400 mr-1">$</span>
        <input
          type="number"
          value={custom}
          onChange={e => handleCustom(e.target.value)}
          placeholder="0.00"
          min="1"
          step="1"
          className="flex-1 outline-none text-sm"
        />
      </div>

      <Annotation>El cargo se rechazará automáticamente si supera este límite.</Annotation>

      <PrimaryBtn onClick={onNext} disabled={!data.limit} className="mt-4">
        Siguiente: Expiración →
      </PrimaryBtn>
      <SecondaryBtn onClick={onBack}>← Atrás</SecondaryBtn>
    </div>
  )
}

// ── Step 3: Expiry ──────────────────────────────────────────
function Step3({ data, setData, onNext, onBack }) {
  const [nUses, setNUses] = useState('3')
  const [date, setDate] = useState('')

  const handleSelect = (id) => {
    setData(d => ({ ...d, expiryType: id }))
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
      <SectionLabel>¿Cuándo expira esta tarjeta?</SectionLabel>
      <div className="space-y-2 mb-4">
        {EXPIRY_OPTIONS.map(o => {
          const Icon = typeof o.icon === 'string' ? (o.id === 'single' ? CheckIcon : o.icon) : o.icon
          return (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all active:scale-[0.99]
                ${data.expiryType === o.id ? 'border-pichincha bg-pichincha/5' : 'border-gray-100 bg-white'}`}
            >
              <span className="text-pichincha"><Icon className="w-5 h-5" /></span>
              <div>
                <p className="text-sm font-semibold">{o.label}</p>
                <p className="text-xs text-gray-500">{o.desc}</p>
              </div>
              {data.expiryType === o.id && <span className="ml-auto text-pichincha"><CheckIcon className="w-5 h-5" /></span>}
            </button>
          )
        })}
      </div>

      {data.expiryType === 'date' && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1 font-semibold">Fecha de expiración</p>
          <input
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setData(d => ({ ...d, expiryDate: e.target.value })) }}
            className="w-full border-2 border-gray-200 focus:border-pichincha outline-none rounded-xl px-3 py-2.5 text-sm transition-colors"
          />
        </div>
      )}

      {data.expiryType === 'n-uses' && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1 font-semibold">Número de usos permitidos</p>
          <input
            type="number"
            value={nUses}
            onChange={e => { setNUses(e.target.value); setData(d => ({ ...d, nUses: parseInt(e.target.value) })) }}
            min="1" max="99"
            className="w-full border-2 border-gray-200 focus:border-pichincha outline-none rounded-xl px-3 py-2.5 text-sm transition-colors"
          />
        </div>
      )}

      <PrimaryBtn onClick={onNext} disabled={!data.expiryType}>
        Revisar resumen →
      </PrimaryBtn>
      <SecondaryBtn onClick={onBack}>← Atrás</SecondaryBtn>
    </div>
  )
}

// ── Step 4: Confirm ─────────────────────────────────────────
function Step4({ data, onConfirm, onBack }) {
  const expiryLabels = {
    single: 'Un solo uso',
    date: data.expiryDate ? `Expira el ${data.expiryDate}` : 'Fecha fija',
    'n-uses': `${data.nUses || 3} usos`,
    manual: 'Sin expiración automática',
  }

  const rows = [
    { label: 'Nombre', value: data.customName || data.purposeLabel },
    { label: 'Propósito', value: data.purposeLabel },
    { label: 'Límite máximo', value: `$${data.limit?.toFixed(2)} USD` },
    { label: 'Expiración', value: expiryLabels[data.expiryType] || '—' },
  ]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
      {/* Preview card */}
      <div className="card-gradient rounded-2xl p-4 mb-4 relative overflow-hidden">
        <span className="absolute top-4 right-4 opacity-60"><CreditCardIcon className="w-8 h-8" /></span>
        <p className="text-xs text-white/70 mb-1">Banco Pichincha Virtual</p>
        <p className="text-base font-bold text-white tracking-widest mb-3">
          •••• •••• •••• {Math.floor(1000 + Math.random() * 8999)}
        </p>
        <div className="flex justify-between text-xs text-white/70">
          <span>Límite: <strong className="text-white">${data.limit?.toFixed(2)}</strong></span>
          <span>{expiryLabels[data.expiryType]}</span>
        </div>
      </div>

      <SectionLabel>Resumen</SectionLabel>
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm space-y-2">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-xs text-gray-500">{r.label}</span>
            <span className="text-sm font-semibold text-gray-800">{r.value}</span>
          </div>
        ))}
      </div>

      <Annotation>
        La tarjeta se activará de inmediato. Podrás bloquearla con un toque desde el panel de tarjetas.
      </Annotation>

      <PrimaryBtn onClick={onConfirm} className="mt-4 flex items-center justify-center gap-2">
        <CheckIcon className="w-4 h-4" />
        <span>Crear tarjeta virtual</span>
      </PrimaryBtn>
      <SecondaryBtn onClick={onBack}>← Modificar</SecondaryBtn>
    </div>
  )
}

// ── Main CreateCard Page ────────────────────────────────────
export default function CreateCard() {
  const { navigate, addCard, showToast } = useApp()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    purpose: null, purposeLabel: '', purposeIcon: '',
    customName: '',
    limit: null,
    expiryType: null, expiryDate: '', nUses: 3,
  })

  const handleConfirm = () => {
    const name = data.customName || data.purposeLabel
    addCard({
      name,
      purpose: data.purposeLabel,
      number: String(Math.floor(1000 + Math.random() * 8999)),
      limit: data.limit,
      expiry: data.expiryDate || (data.expiryType === 'single' ? '1 uso' : '—'),
      color: 'card-gradient',
    })
    showToast(`Tarjeta "${name}" creada exitosamente`, 'success')
    navigate(SCREENS.CARDS_PANEL)
  }

  const steps = [
    <Step1 data={data} setData={setData} onNext={() => setStep(1)} />,
    <Step2 data={data} setData={setData} onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <Step3 data={data} setData={setData} onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <Step4 data={data} onConfirm={handleConfirm} onBack={() => setStep(2)} />,
  ]
  const PurposeIcon = data.purposeIcon

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar />
      <AppHeader
        title="Nueva tarjeta virtual"
        onBack={() => step === 0 ? navigate(SCREENS.CARDS_PANEL) : setStep(s => s - 1)}
      />
      <StepIndicator step={step} />
      <div className="text-center px-4 mb-3">
        <p className="text-sm font-bold">Paso {step + 1}: {STEP_LABELS[step]}</p>
        {step > 0 && data.purposeLabel && (
          <p className="text-xs text-gray-500 mt-0.5 inline-flex items-center justify-center gap-1.5">
            {PurposeIcon && <span className="text-amber-600"><PurposeIcon className="w-3.5 h-3.5" /></span>}
            <span>Propósito: {data.customName || data.purposeLabel}</span>
          </p>
        )}
      </div>
      {steps[step]}
    </div>
  )
}