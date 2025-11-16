import { Link } from 'react-router-dom'
import { ShoppingCart, Pizza, Menu, Star, Phone } from 'lucide-react'
import { useCart } from './CartContext'

export function Navbar() {
  const { items } = useCart()
  const count = items.reduce((s, it) => s + it.quantity, 0)
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
          <Pizza className="text-red-600" /> Blaze Pizza
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-red-600">Home</Link>
          <Link to="/menu" className="hover:text-red-600">Menu</Link>
          <Link to="/about" className="hover:text-red-600">About</Link>
          <a href="#contact" className="hover:text-red-600">Contact</a>
        </nav>
        <Link to="/cart" className="relative inline-flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700">
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full px-2 py-0.5 border">{count}</span>
          )}
        </Link>
      </div>
    </header>
  )
}

export function LandingHero({ featured = [] }) {
  return (
    <section className="relative pt-28 pb-16 bg-gradient-to-br from-red-50 via-white to-amber-50 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Hot. Fresh. Delivered.
              <span className="block text-red-600">Your dream pizza in minutes.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">Crafted with premium ingredients, wood-fired to perfection, and brought to your door piping hot.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/menu" className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-md font-semibold">Explore Menu</Link>
              <a href="#featured" className="px-5 py-3 rounded-md border font-semibold hover:bg-gray-50">See Specials</a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Star className="text-amber-400" /> 4.9/5 rating</div>
              <div className="flex items-center gap-2"><Phone className="text-green-600" /> 24/7 Support</div>
            </div>
          </div>
          <div className="relative">
            <img className="rounded-3xl shadow-2xl" src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxQaXp6YXxlbnwwfDB8fHwxNzYzMjk4MDI5fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Pizza" />
            <div className="absolute -bottom-6 -left-6 bg-white shadow-xl rounded-xl p-4">
              <p className="font-semibold">Free Delivery</p>
              <p className="text-sm text-gray-600">On orders over $20</p>
            </div>
          </div>
        </div>

        <div id="featured" className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Popular Picks</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <img src={p.image} alt={p.name} className="h-40 w-full object-cover group-hover:scale-105 transition" />
                <div className="p-4">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">From ${p.base_price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-white/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} Blaze Pizza • Fresh, fast, and delicious.</p>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-red-600">Privacy</a>
          <a href="#" className="hover:text-red-600">Terms</a>
          <a href="#" className="hover:text-red-600">Support</a>
        </nav>
      </div>
    </footer>
  )
}
