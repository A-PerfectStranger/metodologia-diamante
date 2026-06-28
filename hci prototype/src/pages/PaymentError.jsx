import { useState } from 'react'
import { useApp, SCREENS } from '../context/AppContext'
import {
  StatusBar, AppHeader, PrimaryBtn, SecondaryBtn,
  CreditCardIcon, WalletIcon, RefreshIcon, StoreIcon, SupportIcon, AlertIcon, SparklesIcon, ClockIcon,
} from '../components/shared'

const ERROR_TYPES = {
  limit: {
    icon: CreditCardIcon,
    title: 'Límite alcanzado',
    color: 'border-brand-danger bg-red-50',
    badgeColor: 'bg-red-100 text-brand-danger',
    headline: 'CAUSA: LÍMITE ALCANZADO',
    detail: 'Usaste $14.99 de $15.00 disponibles',
    message:
      'Tu tarjeta virtual "Netflix" llegó a su límite de $15.00. Este cargo de $15.99 no pudo procesarse.',
    actions: [
      { icon: SparklesIcon, title: 'Aumentar el límite', desc: 'Sube el límite de esta tarjeta y reintenta.', screen: SCREENS.CARDS_PANEL },
      { icon: CreditCardIcon, title: 'Crear nueva tarjeta', desc: 'Genera una nueva tarjeta para este comercio.', screen: SCREENS.CREATE_CARD },
      { icon: WalletIcon, title: 'Pagar con saldo principal', desc: 'Usar cuenta corriente directamente.', screen: SCREENS.DASHBOARD },
    ],
  },
  expired: {
    icon: ClockIcon,
    title: 'Tarjeta expirada',
    color: 'border-amber-400 bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-800',
    headline: 'CAUSA: TARJETA EXPIRADA',
    detail: 'Esta tarjeta expiró el 25/06/2026',
    message:
      'Tu tarjeta virtual "Amazon" venció el 25/06/2026. El cargo de $49.99 no pudo procesarse. Puedes crear una nueva tarjeta.',
    actions: [
      { icon: CreditCardIcon, title: 'Crear nueva tarjeta', desc: 'Genera una nueva en menos de 1 minuto.', screen: SCREENS.CREATE_CARD },
      { icon: WalletIcon, title: 'Pagar con saldo principal', desc: 'Usa tu cuenta corriente directamente.', screen: SCREENS.DASHBOARD },
    ],
  },
  merchant: {
    icon: StoreIcon,
    title: 'Rechazo del comercio',
    color: 'border-pichincha/40 bg-blue-50',
    badgeColor: 'bg-blue-100 text-pichincha',
    headline: 'CAUSA: RECHAZO DEL COMERCIO',
    detail: 'El comercio (Netflix) no aceptó el pago',
    message:
      'Tu tarjeta tiene fondos disponibles, pero Netflix rechazó el pago. Contacta al comercio para verificar tu suscripción o método de pago.',
    actions: [
      { icon: RefreshIcon, title: 'Reintentar el pago', desc: 'El problema puede ser temporal.', screen: null },
      { icon: CreditCardIcon, title: 'Usar otra tarjeta', desc: 'Crea una nueva tarjeta para este comercio.', screen: SCREENS.CREATE_CARD },
      { icon: SupportIcon, title: 'Contactar soporte', desc: 'Un agente te ayudará en minutos.', screen: null },
    ],
  },
}

export default function PaymentError() {
  const { navigate, showToast } = useApp()
  const [selected, setSelected] = useState('limit')
  const err = ERROR_TYPES[selected]

  const handleAction = (action) => {
    if (action.screen) {
      navigate(action.screen)
    } else {
      showToast('Función en desarrollo', 'info')
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar />
      <AppHeader title="Estado del pago" />

      {/* Selector de tipo de error (demo) */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          <span className="inline-flex items-center gap-2"><SparklesIcon className="w-4 h-4" /> Demo – Selecciona tipo de rechazo</span>
        </p>
        <div className="flex gap-2">
          {Object.entries(ERROR_TYPES).map(([key, e]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all
                ${selected === key ? 'bg-pichincha border-pichincha text-white' : 'border-gray-200 text-gray-500'}`}
            >
              <span className="inline-flex items-center justify-center gap-1.5">
                {e.icon && <e.icon className="w-3.5 h-3.5" />}
                {e.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {/* Error card */}
        <div className={`border-2 rounded-2xl p-5 mb-4 ${err.color} animate-slide-up`} key={selected}>
          <div className="flex justify-center mb-2"><AlertIcon className="w-10 h-10 text-brand-danger" /></div>
          <h3 className="text-base font-bold text-brand-danger text-center mb-3">Pago rechazado</h3>

          {/* Cause badge */}
          <div className={`rounded-xl px-3 py-2.5 mb-4 text-center ${err.badgeColor}`}>
            <p className="text-xs font-extrabold tracking-wide">{err.headline}</p>
            <p className="text-xs mt-1">{err.detail}</p>
          </div>

          <p className="text-sm text-gray-600 text-center leading-relaxed mb-4">{err.message}</p>

          <div className="border-t border-gray-200/50 pt-3">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">¿Qué deseas hacer?</p>
            <div className="space-y-2">
              {err.actions.map((a, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(a)}
                  className="w-full flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform hover:border-pichincha/20"
                >
                  <span className="flex-shrink-0 text-pichincha"><a.icon className="w-5 h-5" /></span>
                  <div>
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.desc}</p>
                  </div>
                  <span className="ml-auto text-gray-300">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info note */}
        {selected === 'merchant' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
            <p className="text-xs text-pichincha leading-relaxed">
              Cuando el rechazo viene del comercio (no de tu tarjeta), el mensaje siempre aclarará: <em>"Contacta a [comercio] para verificar tu suscripción."</em>
            </p>
          </div>
        )}

        <SecondaryBtn onClick={() => navigate(SCREENS.CARDS_PANEL)}>
          Ver mis tarjetas
        </SecondaryBtn>

        <div className="h-4" />
      </div>
    </div>
  )
}
