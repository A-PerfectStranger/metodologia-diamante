import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

// Simulated exchange data
const BASE_RATE = 0.9218
const COMMISSION = 4.50

export const SCREENS = {
  DASHBOARD: 'dashboard',
  TRANSFER_CONFIRM: 'transfer-confirm',
  TRANSFER_TRACKER: 'transfer-tracker',
  NOTIFICATIONS: 'notifications',
  CREATE_CARD: 'create-card',
  CARDS_PANEL: 'cards-panel',
  PAYMENT_ERROR: 'payment-error',
}

const BOTTOM_NAV_SCREENS = [
  SCREENS.DASHBOARD,
  SCREENS.TRANSFER_TRACKER,
  SCREENS.CARDS_PANEL,
  SCREENS.NOTIFICATIONS,
]

export function AppProvider({ children }) {
  const [screen, setScreen] = useState(SCREENS.DASHBOARD)
  const [prevScreen, setPrevScreen] = useState(null)

  // Transfer state
  const [transfer, setTransfer] = useState({
    amount: 200,
    recipient: 'Nombre Apellido',
    initials: 'MR',
    country: 'España',
    bank: 'BBVA',
    currency: 'EUR',
    rate: BASE_RATE,
    commission: COMMISSION,
    ref: 'BP-20260618-4421',
    confirmedAt: null,
    status: 2, // 0=Iniciada 1=En proceso 2=En tránsito 3=Recibida
  })

  // Virtual cards state
  const [cards, setCards] = useState([
    {
      id: 1,
      name: 'Netflix',
      purpose: 'Suscripción',
      number: '4721',
      limit: 15.00,
      used: 14.99,
      expiry: '30/06/26',
      color: 'card-gradient',
      blocked: false,
      usage: [
        { merchant: 'Netflix', amount: 14.99, date: '01/06/2026', status: 'Cobrado' },
      ],
    },
    {
      id: 2,
      name: 'Amazon',
      purpose: 'Compra única',
      number: '8834',
      limit: 50.00,
      used: 0,
      expiry: '25/07/26',
      color: 'card-gradient-green',
      blocked: false,
      usage: [],
    },
  ])

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Banco Pichincha',
      body: 'Nombre Apellido recibió €184.36. Tu transferencia fue completada.',
      time: 'ahora',
      read: false,
      screen: SCREENS.TRANSFER_TRACKER,
    },
    {
      id: 2,
      title: 'Banco Pichincha',
      body: 'Tu transferencia a España entró en tránsito. Estimado: 11:00 AM.',
      time: '09:20',
      read: true,
      screen: SCREENS.TRANSFER_TRACKER,
    },
  ])

  const [toast, setToast] = useState(null)

  const navigate = useCallback((to) => {
    setPrevScreen(screen)
    setScreen(to)
  }, [screen])

  const goBack = useCallback(() => {
    setScreen(prevScreen || SCREENS.DASHBOARD)
    setPrevScreen(null)
  }, [prevScreen])

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const blockCard = useCallback((id) => {
    setCards(cs => cs.map(c => c.id === id ? { ...c, blocked: !c.blocked } : c))
  }, [])

  const addCard = useCallback((card) => {
    setCards(cs => [...cs, { ...card, id: Date.now(), used: 0, blocked: false, usage: [] }])
  }, [])

  const advanceTransferStatus = useCallback(() => {
    setTransfer(t => ({
      ...t,
      status: Math.min(t.status + 1, 3),
    }))
  }, [])

  const markNotificationsRead = useCallback(() => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const ctx = {
    screen,
    navigate,
    goBack,
    transfer,
    setTransfer,
    cards,
    blockCard,
    addCard,
    notifications,
    markNotificationsRead,
    unreadCount,
    advanceTransferStatus,
    toast,
    showToast,
    BOTTOM_NAV_SCREENS,
    BASE_RATE,
    COMMISSION,
  }

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
