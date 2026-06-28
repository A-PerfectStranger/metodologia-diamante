import { useEffect } from 'react'
import { useApp, SCREENS } from '../context/AppContext'
import {
  StatusBar, PinIcon, CreditCardIcon, WalletIcon,
  LockIcon, ChartIcon, BellIcon,
} from '../components/shared'

export default function Notifications() {
  const { notifications, markNotificationsRead, navigate } = useApp()

  useEffect(() => {
    const id = setTimeout(markNotificationsRead, 800)
    return () => clearTimeout(id)
  }, [])

  const handleNotifClick = (n) => {
    navigate(n.screen || SCREENS.TRANSFER_TRACKER)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StatusBar dark />

      {/* Lock screen simulation area */}
      <div className="lock-screen-bg flex-1 overflow-y-auto scrollbar-hide px-4 py-6">
        <div className="text-center mb-8">
          <p className="text-white/50 text-sm mb-1">Jueves, 18 de junio</p>
          <p className="text-white text-5xl font-thin tracking-tight">11:03</p>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <button
              key={n.id}
              onClick={() => handleNotifClick(n)}
              className={`w-full text-left bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 flex gap-3 items-start
                active:scale-[0.98] transition-all border border-white/10
                animate-notif-drop`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="flex-shrink-0 mt-0.5 text-white/80"><WalletIcon className="w-6 h-6" /></span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  <p className="text-[11px] text-white/50 flex-shrink-0 ml-2">{n.time}</p>
                </div>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">{n.body}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />
              )}
            </button>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center mt-16">
            <div className="mb-3 flex justify-center"><BellIcon className="w-10 h-10 text-white/50" /></div>
            <p className="text-white/50 text-sm">Sin notificaciones pendientes</p>
          </div>
        )}

        <div className="mt-8 bg-white/5 border border-dashed border-white/20 rounded-xl p-3">
          <p className="text-[11px] text-white/40 text-center">
            <span className="inline-flex items-center justify-center gap-2"><PinIcon className="w-3.5 h-3.5" /> Al tocar una notificación se abre la pantalla de seguimiento correspondiente.</span>
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}