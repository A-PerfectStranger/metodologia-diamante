import { useApp, SCREENS } from '../context/AppContext'

// ────────────────────────────────────────────────────────────
// Status Bar
// ────────────────────────────────────────────────────────────
export function StatusBar({ dark = false }) {
  const now = new Date()
  const time = now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false })
  return (
    <div className={`flex justify-between items-center px-4 py-2 text-xs font-medium ${dark ? 'bg-brand-dark text-white' : 'bg-pichincha text-white'}`}>
      <span>{time}</span>
      <span className="flex gap-1 items-center">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7h1.5a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 014.5 17H3V7zm4.5 1h10a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5H7.5V8zm12 2h.5A1.5 1.5 0 0121.5 11.5v1a1.5 1.5 0 01-1.5 1.5H19V10z"/></svg>
      </span>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// App Header
// ────────────────────────────────────────────────────────────
export function AppHeader({ title, showBack = true, right = null, onBack }) {
  const { goBack } = useApp()
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-pichincha text-white">
      {showBack && (
        <button onClick={onBack || goBack} className="text-xl leading-none opacity-80 hover:opacity-100 transition-opacity p-0.5">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      )}
      {title ? <h2 className="flex-1 text-base font-semibold tracking-tight">{title}</h2> : <div className="flex-1" />}
      {right}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Bottom Navigation
// ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { screen: SCREENS.DASHBOARD, icon: HomeIcon, label: 'Inicio' },
  { screen: SCREENS.TRANSFER_TRACKER, icon: TransferIcon, label: 'Envíos' },
  { screen: SCREENS.CARDS_PANEL, icon: CardIcon, label: 'Tarjetas' },
  { screen: SCREENS.NOTIFICATIONS, icon: BellIcon, label: 'Alertas' },
]

export function BottomNav() {
  const { screen, navigate, unreadCount } = useApp()
  return (
    <div className="border-t border-gray-100 bg-white grid grid-cols-4 py-1.5 safe-area-pb">
      {NAV_ITEMS.map(({ screen: s, icon: Icon, label }) => {
        const active = screen === s
        const isAlert = s === SCREENS.NOTIFICATIONS
        return (
          <button
            key={s}
            onClick={() => navigate(s)}
            className="flex flex-col items-center gap-0.5 py-1 relative"
          >
            <span className={`relative transition-colors ${active ? 'text-pichincha' : 'text-gray-400'}`}>
              <Icon className="w-5 h-5" />
              {isAlert && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-brand-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </span>
            <span className={`text-[10px] font-medium transition-colors ${active ? 'text-pichincha' : 'text-gray-400'}`}>
              {label}
            </span>
            {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-pichincha rounded-full" />}
          </button>
        )
      })}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Shared small components
// ────────────────────────────────────────────────────────────
export function Tag({ color = 'blue', children }) {
  const map = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-pichincha',
    orange: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-brand-danger',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${map[color]}`}>
      {children}
    </span>
  )
}

export function Avatar({ initials, size = 'md' }) {
  const s = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'
  return (
    <div className={`${s} rounded-full bg-pichincha text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}

export function Annotation({ children }) {
  return (
    <div className="bg-amber-50 border-2 border-dashed border-brand-warning rounded-lg p-3 mt-2">
      <p className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
        <PinIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>{children}</span>
      </p>
    </div>
  )
}

export function Divider() {
  return <div className="h-px bg-gray-100 my-3" />
}

export function SectionLabel({ children }) {
  return <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{children}</p>
}

export function PrimaryBtn({ children, onClick, disabled = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-pichincha text-white font-semibold text-sm py-3.5 rounded-xl mt-2 disabled:opacity-50 active:scale-[0.98] transition-transform ${className}`}
    >
      {children}
    </button>
  )
}

export function SecondaryBtn({ children, onClick, danger = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full font-semibold text-sm py-3 rounded-xl border-2 mt-1.5 active:scale-[0.98] transition-transform
        ${danger
          ? 'border-brand-danger text-brand-danger bg-red-50'
          : 'border-pichincha text-pichincha bg-white'
        } ${className}`}
    >
      {children}
    </button>
  )
}

// ────────────────────────────────────────────────────────────
// Toast notification
// ────────────────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null
  const bg = toast.type === 'success' ? 'bg-brand-success' : toast.type === 'error' ? 'bg-brand-danger' : 'bg-pichincha'
  return (
    <div className={`absolute top-16 left-3 right-3 z-50 ${bg} text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg toast-enter flex items-center gap-2`}>
      <span>{toast.type === 'success' ? <CheckIcon className="w-4 h-4" /> : <AlertIcon className="w-4 h-4" />}</span>
      {toast.msg}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// SVG Icons
// ────────────────────────────────────────────────────────────
export function ArrowLeftIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function ArrowRightIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function CheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l3.5 3.5L19 6.5" />
    </svg>
  )
}

export function AlertIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export function PinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4" />
      <path d="M12 7a4 4 0 00-4 4c0 2.5 4 8 4 8s4-5.5 4-8a4 4 0 00-4-4z" />
    </svg>
  )
}

export function WalletIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      <path d="M16 12h4" />
    </svg>
  )
}

export function CreditCardIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  )
}

export function GlobeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
    </svg>
  )
}

export function ChartIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19h16" />
      <path d="M7 15v-4" />
      <path d="M12 15V7" />
      <path d="M17 15v-2" />
    </svg>
  )
}

export function ShieldIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-2.8 7.7-7 10-4.2-2.3-7-5.5-7-10V6l7-3z" />
    </svg>
  )
}

export function EyeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0013.4 13.4" />
      <path d="M9.88 5.08A10.8 10.8 0 0112 5c6.5 0 10 7 10 7a18.4 18.4 0 01-2.6 3.2" />
      <path d="M6.61 6.61A17.8 17.8 0 002 12s3.5 6 10 6c1.2 0 2.3-.16 3.3-.45" />
    </svg>
  )
}

export function RefreshIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 11-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

export function ClockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function SparklesIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </svg>
  )
}

export function StoreIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l9-4 9 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      <path d="M8 11h8" />
    </svg>
  )
}

export function SupportIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17v2" />
      <path d="M9 20h6" />
      <path d="M12 3a6 6 0 00-6 6v1a3 3 0 01-3 3v2a3 3 0 003 3h12a3 3 0 003-3v-2a3 3 0 01-3-3V9a6 6 0 00-6-6z" />
    </svg>
  )
}

export function PlaneIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13l18-7-6 6-4 8-2-7-6-7z" />
    </svg>
  )
}

export function CartIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.6 10.2a1 1 0 00.9.8h7.8a1 1 0 00.9-.7L17 8H7" />
    </svg>
  )
}

export function PencilIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3l8 8-10 10H3v-8L13 3z" />
    </svg>
  )
}

export function CalendarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

export function HashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M9 3L7 21" />
      <path d="M17 3l-2 18" />
    </svg>
  )
}

export function InfinityIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 7c-3 0-5 2-5 5s2 5 5 5c2.5 0 4-1.5 5-3.5 1-2 2.5-3.5 5-3.5 3 0 5 2 5 5s-2 5-5 5" />
    </svg>
  )
}

export function DocumentIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h7l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M14 3v5h5" />
    </svg>
  )
}

export function LockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V8a4 4 0 018 0v2" />
    </svg>
  )
}

export function UnlockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V8a4 4 0 017.6-2" />
    </svg>
  )
}

export function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

export function SendIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  )
}

export function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export function PlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function InfoIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  )
}

export function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}
export function TransferIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-8l3 3m0 0l-3 3m3-3H9m3 8l3 3m0 0l-3 3m3-3H9" />
    </svg>
  )
}
export function CardIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h.01M11 15h2M3 7h18a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z" />
    </svg>
  )
}
export function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}
