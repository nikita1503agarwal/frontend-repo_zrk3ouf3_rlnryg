import { Routes, Route, Link } from 'react-router-dom'
import { Navbar, LandingHero, Footer } from './components/UI'
import { CartProvider } from './components/CartContext'
import { HomePage, MenuPage, ProductPage, CartPage, CheckoutPage } from './components/Pages'
import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [featured, setFeatured] = useState([])
  useEffect(() => {
    fetch(`${API}/api/featured`).then(r => r.json()).then(setFeatured).catch(()=>setFeatured([]))
  }, [])

  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<>
          <LandingHero featured={featured} />
        </>} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      <Footer />
    </CartProvider>
  )
}

export default App
