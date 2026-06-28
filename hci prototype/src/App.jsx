import { useApp, SCREENS } from './context/AppContext'
import { BottomNav, Toast } from './components/shared'
import Dashboard from './pages/Dashboard'
import TransferConfirm from './pages/TransferConfirm'
import TransferTracker from './pages/TransferTracker'
import Notifications from './pages/Notifications'
import CreateCard from './pages/CreateCard'
import CardsPanel from './pages/CardsPanel'
import PaymentError from './pages/PaymentError'

const BOTTOM_NAV_SCREENS = [
  SCREENS.DASHBOARD,
  SCREENS.TRANSFER_TRACKER,
  SCREENS.CARDS_PANEL,
]

function Screen({ screen }) {
  switch (screen) {
    case SCREENS.DASHBOARD:       return <Dashboard />
    case SCREENS.TRANSFER_CONFIRM: return <TransferConfirm />
    case SCREENS.TRANSFER_TRACKER: return <TransferTracker />
    case SCREENS.NOTIFICATIONS:    return <Notifications />
    case SCREENS.CREATE_CARD:      return <CreateCard />
    case SCREENS.CARDS_PANEL:      return <CardsPanel />
    case SCREENS.PAYMENT_ERROR:    return <PaymentError />
    default:                       return <Dashboard />
  }
}

function AppShell() {
  const { screen, toast } = useApp()
  const showNav = BOTTOM_NAV_SCREENS.includes(screen)

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center p-2 sm:p-4">
      {/* Desktop label */}
      <div className="hidden md:block absolute top-6 left-6 text-slate-400 text-xs font-semibold tracking-widest uppercase">
        Banco Pichincha · HCI Prototype
      </div>

      {/* Phone frame */}
      <div
        className="w-full max-w-[340px] min-h-0 bg-white rounded-[36px] overflow-hidden shadow-2xl border border-white/50 flex flex-col relative"
        style={{ width: 'min(100%, 340px)', height: 'min(calc(100dvh - 1.25rem), 680px)', maxHeight: 'calc(100dvh - 1.25rem)' }}
      >
        {/* Toast overlay */}
        <Toast toast={toast} />

        {/* Screen content */}
        <div key={screen} className="flex flex-col flex-1 min-h-0 animate-fade-in overflow-hidden">
          <Screen screen={screen} />
        </div>

        {/* Bottom navigation */}
        {showNav && <BottomNav />}

        {/* Phone home indicator */}
        <div className="flex justify-center py-2 bg-white">
          <div className="w-28 h-1 bg-gray-200 rounded-full" />
        </div>
      </div>

    </div>
  )
}

export default AppShell
