import { useState, useEffect, useRef } from 'react'
import { useApp, SCREENS } from '../context/AppContext'
import {
  StatusBar, AppHeader, Annotation, Tag, Divider, SecondaryBtn, Avatar,
  SendIcon, SearchIcon, RefreshIcon, CheckIcon, ClockIcon, SparklesIcon, XIcon,
} from '../components/shared'

const STEPS = [
  {
    key: 'Iniciada',
    icon: SendIcon,
    time: '09:15 AM',
    desc: '18/06/2026 · La transferencia fue registrada.',
  },
  {
    key: 'En proceso',
    icon: SearchIcon,
    time: '09:17 AM',
    desc: '18/06/2026 · Verificación de seguridad completada.',
  },
  {
    key: 'En tránsito',
    icon: RefreshIcon,
    time: '09:20 AM',
    desc: '18/06/2026 · Procesando en banco receptor.',
  },
  {
    key: 'Recibida',
    icon: CheckIcon,
    time: 'Estimado: 11:00 AM',
    desc: '18/06/2026 · Fondos disponibles para el destinatario.',
  },
]

export default function TransferTracker() {
  const { navigate, transfer, setTransfer, notifications, showToast } = useApp()
  const [status, setStatus] = useState(transfer.status)
  const [cancelVisible, setCancelVisible] = useState(transfer.status < 2)
  const [advancing, setAdvancing] = useState(false)
  const prevStatus = useRef(status)

  // Sync with context when coming back
  useEffect(() => { setStatus(transfer.status) }, [transfer.status])

  // If En proceso, auto-advance to En tránsito after 4s (demo)
  useEffect(() => {
    if (status === 1) {
      const id = setTimeout(() => {
        setStatus(2)
        setTransfer(t => ({ ...t, status: 2 }))
        showToast('Transferencia en tránsito', 'success')
      }, 4000)
      return () => clearTimeout(id)
    }
  }, [status])

  const handleSimulateAdvance = () => {
    if (status >= 3 || advancing) return
    setAdvancing(true)
    setTimeout(() => {
      const next = Math.min(status + 1, 3)
      setStatus(next)
      setTransfer(t => ({ ...t, status: next }))
      showToast(`Estado: ${STEPS[next].key}`, 'success')
      setAdvancing(false)
      if (next >= 2) setCancelVisible(false)
    }, 600)
  }

  const handleCancel = () => {
    showToast('Transferencia cancelada. Reembolso en 1-2 días hábiles.', 'error')
    setTimeout(() => navigate(SCREENS.DASHBOARD), 1500)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar />
      <AppHeader
        title="Seguimiento de envío"
        right={
          <span className="text-xs text-white/70 font-mono">#{transfer.ref?.slice(-6)}</span>
        }
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {/* Summary card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex gap-3 items-center mb-4">
          <Avatar initials={transfer.initials || 'MR'} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">${transfer.amount} USD → €{((transfer.amount) * (transfer.rate || 0.9218)).toFixed(2)} EUR</p>
            <p className="text-xs text-gray-500">A {transfer.recipient} · {transfer.country}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">Ref. #{transfer.ref}</p>
          </div>
          <Tag color={status === 3 ? 'green' : status >= 2 ? 'blue' : 'orange'}>
            {STEPS[status]?.key}
          </Tag>
        </div>

        {/* Tracker steps */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Estado de la transferencia</p>
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm">
          {STEPS.map((step, i) => {
            const done = i < status
            const active = i === status
            const pending = i > status

            return (
              <div key={step.key}>
                <div className="flex gap-3 items-start">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 transition-all duration-500
                    ${done ? 'bg-brand-success text-white' :
                      active ? 'bg-pichincha text-white animate-pulse-dot' :
                      'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {done ? <CheckIcon className="w-4 h-4" /> : active ? <step.icon className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  {/* Text */}
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${pending ? 'text-gray-300' : ''}`}>
                        {step.key}
                      </h4>
                      {active && (
                        <span className="text-[10px] font-bold bg-pichincha/10 text-pichincha px-2 py-0.5 rounded-full">
                          ACTUAL
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${pending ? 'text-gray-300' : 'text-gray-500'}`}>
                      {active || done ? step.time + ' · ' + step.desc : step.time}
                    </p>
                  </div>
                </div>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className={`ml-4 w-0.5 h-6 rounded-full transition-colors duration-500 ${i < status ? 'bg-brand-success' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* ETA */}
        {status < 3 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-pichincha" />
            <p className="text-xs text-pichincha font-medium">
              Tiempo estimado restante: <strong>1h {Math.max(0, 40 - status * 15)} min</strong>
            </p>
          </div>
        )}

        {status === 3 && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <span className="text-2xl"><CheckIcon className="w-6 h-6 text-brand-success" /></span>
            <div>
              <p className="text-sm font-bold text-brand-success">¡Transferencia completada!</p>
              <p className="text-xs text-green-700">{transfer.recipient} recibió los fondos exitosamente.</p>
            </div>
          </div>
        )}

        <Annotation>
          Recibirás una notificación cuando {transfer.recipient} reciba el dinero.
        </Annotation>

        {/* Demo advance button */}
        {status < 3 && (
          <button
            onClick={handleSimulateAdvance}
            disabled={advancing}
            className="w-full mt-4 border-2 border-dashed border-pichincha/30 text-pichincha/60 text-xs font-medium py-2.5 rounded-xl hover:border-pichincha/50 active:scale-[0.98] transition-all disabled:opacity-40"
          >
            <span className="inline-flex items-center justify-center gap-2"><SparklesIcon className="w-4 h-4" />{advancing ? 'Simulando...' : 'Simular avance de estado (demo)'}</span>
          </button>
        )}

        {cancelVisible && status < 2 && (
          <button
            onClick={handleCancel}
            className="w-full mt-2 border-2 border-brand-danger/30 text-brand-danger text-sm font-semibold py-3 rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all"
          >
            <span className="inline-flex items-center justify-center gap-2"><XIcon className="w-4 h-4" /> Cancelar transferencia</span>
          </button>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
