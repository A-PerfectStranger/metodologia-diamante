import { useState, useEffect } from 'react'
import { useApp, SCREENS } from '../context/AppContext'
import {
  StatusBar, AppHeader, Annotation, Divider, PrimaryBtn, SecondaryBtn, Avatar,
  ClockIcon, CheckIcon, PencilIcon,
} from '../components/shared'

const COMMISSION = 4.50
const BASE_RATE = 0.9218

function fmt(val, sym = '$', d = 2) {
  return `${sym}${Number(val).toFixed(d)}`
}

export default function TransferConfirm() {
  const { navigate, transfer, setTransfer, showToast } = useApp()

  const [amount, setAmount] = useState(transfer.amount.toString())
  const [rate, setRate] = useState(BASE_RATE)
  const [lastSec, setLastSec] = useState(0)
  const [confirming, setConfirming] = useState(false)

  // Live rate update every 15s
  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.0005
      setRate(r => parseFloat((r + delta).toFixed(4)))
      setLastSec(s => s + 15)
    }, 15000)
    return () => clearInterval(id)
  }, [])

  const num = Math.max(0, parseFloat(amount) || 0)
  const totalDebit = num + COMMISSION
  const received = (num * rate).toFixed(2)

  const handleConfirm = () => {
    setConfirming(true)
    setTimeout(() => {
      setTransfer(t => ({
        ...t,
        amount: num,
        rate,
        commission: COMMISSION,
        status: 1,
        confirmedAt: new Date().toISOString(),
      }))
      showToast('Transferencia iniciada exitosamente', 'success')
      navigate(SCREENS.TRANSFER_TRACKER)
    }, 900)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar />
      <AppHeader title="Confirmar transferencia" />

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-1">
        {/* Recipient */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Destinatario</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex gap-3 items-center mb-3">
          <Avatar initials={transfer.initials} />
          <div>
            <p className="text-sm font-bold">{transfer.recipient}</p>
            <p className="text-xs text-gray-500">{transfer.country} · {transfer.bank}</p>
          </div>
        </div>

        {/* Amount input */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Monto a enviar</p>
        <div className="bg-pichincha rounded-xl p-4 mb-3">
          <p className="text-xs text-white/70 mb-1">Tú envías</p>
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl font-light">$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
              step="10"
              className="bg-transparent text-white text-3xl font-extrabold flex-1 outline-none min-w-0"
              placeholder="0"
            />
            <span className="text-white/70 text-sm font-semibold">USD</span>
          </div>
        </div>

        {/* Rate badge */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-amber-500" />
          <p className="text-xs text-amber-800 font-medium">
            Tipo de cambio actualizado{lastSec > 0 ? ` hace ${lastSec}s` : ' ahora'} · USD/EUR: {rate}
          </p>
        </div>

        {/* Cost breakdown */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Desglose de costos</p>
        <div className="bg-blue-50 border-2 border-pichincha/30 rounded-xl p-4 mb-3">
          <Row label="Monto base" value={fmt(num)} />
          <Divider />
          <Row label="Comisión banco" value={fmt(COMMISSION)} valueClass="text-gray-700" />
          <Row label="Tipo de cambio" value={`× ${rate}`} valueClass="text-gray-700" />
          <Divider />
          <Row
            label="Total debitado"
            value={fmt(totalDebit)}
            labelClass="font-bold"
            valueClass="text-brand-danger text-base font-bold"
          />
          <Row
            label={`${transfer.recipient} recibe`}
            value={fmt(received, '€')}
            labelClass="font-bold"
            valueClass="text-pichincha text-lg font-extrabold"
          />
        </div>

        <Annotation>
          El tipo de cambio puede variar hasta que se confirme. El monto final se fija al presionar <strong>Confirmar</strong>.
        </Annotation>

        <PrimaryBtn onClick={handleConfirm} disabled={confirming || num <= 0} className="mt-4 flex items-center justify-center gap-2">
          {confirming ? <><ClockIcon className="w-4 h-4" /> Procesando...</> : <><CheckIcon className="w-4 h-4" /> Confirmar transferencia</>}
        </PrimaryBtn>
        <SecondaryBtn onClick={() => navigate(SCREENS.DASHBOARD)} className="flex items-center justify-center gap-2">
          <PencilIcon className="w-4 h-4" />
          <span>Modificar / Cancelar</span>
        </SecondaryBtn>

        <div className="h-4" />
      </div>
    </div>
  )
}

function Row({ label, value, labelClass = '', valueClass = 'text-gray-800 font-semibold' }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className={`text-sm text-gray-600 ${labelClass}`}>{label}</span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}
