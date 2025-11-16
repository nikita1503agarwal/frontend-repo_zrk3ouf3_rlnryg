import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const add = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.pizza_id === item.pizza_id && it.size === item.size
      )
      if (idx !== -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity }
        return copy
      }
      return [...prev, item]
    })
  }

  const remove = (pizza_id, size) => {
    setItems((prev) => prev.filter((it) => !(it.pizza_id === pizza_id && it.size === size)))
  }

  const clear = () => setItems([])

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.unit_price * it.quantity, 0), [items])

  const value = { items, add, remove, clear, subtotal }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
