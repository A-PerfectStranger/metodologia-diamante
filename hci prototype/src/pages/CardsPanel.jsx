import { useState } from 'react'
import { useApp, SCREENS } from '../context/AppContext'
import {
  StatusBar, AppHeader, SectionLabel, PrimaryBtn, SecondaryBtn,
  LockIcon, UnlockIcon, DocumentIcon, AlertIcon, CreditCardIcon,
  PlusIcon, SparklesIcon,
} from '../components/shared'

const CARD_COLORS = {
  'card-gradient': 'linear-gradient(135deg, #1F3864 0%, #2d5f9e 100%)',
  'card-gradient-green': 'linear-gradient(135deg, #1a6b2e 0%, #27ae60 100%)',
  'card-gradient-indigo': 'linear-gradient(135deg, #3b2d8a 0%, #6c5ce7 100%)',
}

function VirtualCard({ card, onBlock, onViewUsage, onPaymentError }) {
  const pct = card.limit > 0 ? Math.round((card.used / card.limit) * 100) : 0
  const bg = CARD_COLORS[card.color] || CARD_COLORS['card-gradient']
  const remaining = (card.limit - card.used).toFixed(2)
  const isCritical = pct >= 90

  return (
    <div className="mb-4 animate-slide-up">
      {/* Visual card */}
      <div
        className={`rounded-2xl p-4 relative overflow-hidden mb-2 ${card.blocked ? 'opacity-50' : ''}`}
        style={{ background: bg }}
      >
        {card.blocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-10">
            <span className="text-white text-lg font-bold flex items-center gap-2"><LockIcon className="w-5 h-5" /> Bloqueada</span>
          </div>
        )}
        <span className="absolute top-4 right-4 opacity-60"><CreditCardIcon className="w-8 h-8" /></span>
        <p className="text-xs text-white/70 mb-1">{card.name} · {card.purpose}</p>
        <p className="text-sm font-bold text-white tracking-[3px] mb-3">
          •••• •••• •••• {card.number}
        </p>
        <div className="flex justify-between text-xs mb-2">
          <div><p className="text-white/60">Límite</p><p className="text-white font-bold">${card.limit.toFixed(2)}</p></div>
          <div className="text-center"><p className="text-white/60">Disponible</p><p className={`font-bold ${isCritical ? 'text-red-300' : 'text-white'}`}>${remaining}</p></div>
          <div className="text-right"><p className="text-white/60">Expira</p><p className="text-white font-bold">{card.expiry}</p></div>
        </div>
        {/* Usage bar */}
        <div className="bg-white/20 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full progress-inner ${isCritical ? 'bg-red-400' : 'bg-white'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/60 mt-1">
          <span>Usado: ${card.used.toFixed(2)}</span>
          <span>{pct}% del límite</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onBlock(card.id)}
          className={`flex-1 text-xs font-semibold py-2 rounded-xl border-2 active:scale-[0.97] transition-all
            ${card.blocked
              ? 'bg-green-50 border-brand-success text-brand-success'
              : 'bg-red-50 border-brand-danger text-brand-danger'}`}
        >
          <span className="inline-flex items-center justify-center gap-1.5">
            {card.blocked ? <UnlockIcon className="w-4 h-4" /> : <LockIcon className="w-4 h-4" />}
            {card.blocked ? 'Desbloquear' : 'Bloquear'}
          </span>
        </button>
        <button
          onClick={() => onViewUsage(card)}
          className="flex-1 text-xs font-semibold py-2 rounded-xl border-2 border-pichincha/30 text-pichincha bg-pichincha/5 active:scale-[0.97] transition-all"
        >
          <span className="inline-flex items-center justify-center gap-1.5"><DocumentIcon className="w-4 h-4" /> Ver uso</span>
        </button>
        {isCritical && !card.blocked && (
          <button
            onClick={() => onPaymentError(card)}
            className="px-3 text-xs font-semibold py-2 rounded-xl border-2 border-amber-400 text-amber-700 bg-amber-50 active:scale-[0.97] transition-all"
          >
            <AlertIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Usage history modal
function UsageModal({ card, onClose }) {
  if (!card) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-3.5 bg-pichincha text-white">
        <button onClick={onClose} className="text-xl leading-none opacity-80">←</button>
        <h2 className="flex-1 text-base font-semibold">Uso · {card.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Límite</span>
            <span className="font-bold">${card.limit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Usado</span>
            <span className="font-bold text-brand-danger">${card.used.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Disponible</span>
            <span className="font-bold text-brand-success">${(card.limit - card.used).toFixed(2)}</span>
          </div>
        </div>

        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Historial de cargos</p>

        {card.usage.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-2 flex justify-center"><DocumentIcon className="w-10 h-10 text-gray-300" /></div>
            <p className="text-sm text-gray-400">Sin cargos registrados</p>
            <p className="text-xs text-gray-300 mt-1">Esta tarjeta aún no ha sido usada.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {card.usage.map((u, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-sm font-semibold">{u.merchant}</p>
                  <p className="text-xs text-gray-500">{u.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">${u.amount.toFixed(2)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.status === 'Cobrado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{u.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CardsPanel() {
  const { navigate, cards, blockCard, showToast } = useApp()
  const [usageCard, setUsageCard] = useState(null)

  const handleBlock = (id) => {
    const card = cards.find(c => c.id === id)
    blockCard(id)
    showToast(card.blocked ? `Tarjeta "${card.name}" desbloqueada` : `Tarjeta "${card.name}" bloqueada`, card.blocked ? 'success' : 'info')
  }

  const activeCards = cards.filter(c => !c.blocked)
  const blockedCards = cards.filter(c => c.blocked)

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Usage modal */}
      {usageCard && <UsageModal card={usageCard} onClose={() => setUsageCard(null)} />}

      <StatusBar />
      <AppHeader
        title="Mis tarjetas virtuales"
        showBack={false}
        right={
          <button onClick={() => navigate(SCREENS.CREATE_CARD)} className="text-white text-xl font-light opacity-80 hover:opacity-100">
            ＋
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {cards.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-3 flex justify-center"><CreditCardIcon className="w-12 h-12 text-pichincha/70" /></div>
            <p className="text-base font-bold text-gray-700">Sin tarjetas virtuales</p>
            <p className="text-sm text-gray-400 mt-1">Crea tu primera tarjeta en menos de 1 minuto.</p>
          </div>
        )}

        {activeCards.length > 0 && (
          <>
            <SectionLabel>Activas ({activeCards.length})</SectionLabel>
            {activeCards.map(card => (
              <VirtualCard
                key={card.id}
                card={card}
                onBlock={handleBlock}
                onViewUsage={setUsageCard}
                onPaymentError={() => navigate(SCREENS.PAYMENT_ERROR)}
              />
            ))}
          </>
        )}

        {blockedCards.length > 0 && (
          <>
            <SectionLabel>Bloqueadas ({blockedCards.length})</SectionLabel>
            {blockedCards.map(card => (
              <VirtualCard
                key={card.id}
                card={card}
                onBlock={handleBlock}
                onViewUsage={setUsageCard}
                onPaymentError={() => navigate(SCREENS.PAYMENT_ERROR)}
              />
            ))}
          </>
        )}

        <button
          onClick={() => navigate(SCREENS.CREATE_CARD)}
          className="w-full border-2 border-dashed border-pichincha/30 text-pichincha/70 rounded-2xl py-4 text-sm font-semibold active:bg-pichincha/5 transition-colors mb-4"
        >
          <span className="inline-flex items-center justify-center gap-2"><PlusIcon className="w-4 h-4" /> Crear nueva tarjeta virtual</span>
        </button>

        {/* Payment error demo link */}
        <button
          onClick={() => navigate(SCREENS.PAYMENT_ERROR)}
          className="w-full border border-gray-100 text-gray-400 rounded-xl py-2.5 text-xs font-medium hover:bg-gray-50 transition-colors"
        >
          <span className="inline-flex items-center justify-center gap-2"><SparklesIcon className="w-4 h-4" /> Simular pago rechazado (demo P5)</span>
        </button>

        <div className="h-4" />
      </div>
    </div>
  )
}
