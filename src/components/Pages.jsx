import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function HomePage() {
  const [featured, setFeatured] = useState([])
  useEffect(() => {
    fetch(`${API}/api/featured`).then(r => r.json()).then(setFeatured).catch(() => setFeatured([]))
  }, [])
  return (
    <div>
      {/* Landing content provided by UI.LandingHero via App */}
    </div>
  )
}

export function MenuPage() {
  const [pizzas, setPizzas] = useState([])
  useEffect(() => {
    fetch(`${API}/api/pizzas`).then(r => r.json()).then(setPizzas).catch(() => setPizzas([]))
  }, [])
  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-12">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pizzas.map(p => (
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
  )
}

export function ProductPage() {
  const { id } = useParams()
  const [pizza, setPizza] = useState(null)
  const [size, setSize] = useState('Medium')
  const { add } = useCart()

  useEffect(() => {
    fetch(`${API}/api/pizzas/${id}`).then(r => r.json()).then(setPizza)
  }, [id])

  if (!pizza) return <div className="pt-28 max-w-6xl mx-auto px-4">Loading...</div>

  const priceMultiplier = size === 'Small' ? 1 : size === 'Medium' ? 1.25 : 1.5
  const price = pizza.base_price * priceMultiplier

  const addToCart = () => {
    add({
      pizza_id: pizza.id,
      name: pizza.name,
      size,
      unit_price: price,
      quantity: 1,
      image: pizza.image,
    })
  }

  return (
    <div className="pt-28 pb-12 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
      <img src={pizza.image} alt={pizza.name} className="w-full h-80 object-cover rounded-2xl shadow" />
      <div>
        <h1 className="text-3xl font-bold">{pizza.name}</h1>
        <p className="mt-2 text-gray-600">{pizza.description}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Choose size</p>
          <div className="flex gap-2">
            {pizza.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`px-3 py-1 rounded border ${size===s? 'bg-red-600 text-white border-red-600':'hover:bg-gray-50'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-2xl font-bold">${price.toFixed(2)}</div>
          <button onClick={addToCart} className="bg-red-600 text-white px-5 py-3 rounded-md hover:bg-red-700">Add to cart</button>
        </div>
      </div>
    </div>
  )
}

export function CartPage() {
  const { items, remove, subtotal, clear } = useCart()
  const navigate = useNavigate()

  const deliveryFee = subtotal > 20 ? 0 : 3.5
  const total = subtotal + deliveryFee

  return (
    <div className="pt-28 pb-12 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate('/menu')} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md">Browse Menu</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow divide-y">
            {items.map((it) => (
              <div key={`${it.pizza_id}-${it.size}`} className="p-4 flex items-center gap-4">
                <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{it.name} • {it.size}</div>
                  <div className="text-sm text-gray-600">${it.unit_price.toFixed(2)} × {it.quantity}</div>
                </div>
                <button onClick={() => remove(it.pizza_id, it.size)} className="text-red-600 hover:underline">Remove</button>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow p-4 h-fit">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-600 mt-1"><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span></div>
            <div className="border-t mt-3 pt-3 flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button onClick={() => navigate('/checkout')} className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-md">Checkout</button>
            <button onClick={clear} className="w-full mt-2 border px-4 py-2 rounded-md">Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  )
}

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const deliveryFee = subtotal > 20 ? 0 : 3.5
  const total = subtotal + deliveryFee

  const placeOrder = async () => {
    const order = {
      customer: { name, phone, address },
      items: items.map(({ pizza_id, name, size, unit_price, quantity, image }) => ({ pizza_id, name, size, unit_price, quantity, image })),
      notes: '',
      subtotal,
      delivery_fee: deliveryFee,
      total,
    }
    const res = await fetch(`${API}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })
    const data = await res.json()
    if (res.ok) {
      clear()
      navigate(`/order/${data.id}`)
    } else {
      alert(data.detail || 'Failed to place order')
    }
  }

  return (
    <div className="pt-28 pb-12 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="(555) 555-5555" />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea value={address} onChange={(e)=>setAddress(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="123 Main St, City" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="font-semibold">Total: ${total.toFixed(2)}</div>
          <button onClick={placeOrder} disabled={!name || !phone || !address || items.length===0} className="bg-red-600 disabled:opacity-50 text-white px-5 py-2 rounded-md">Place Order</button>
        </div>
      </div>
    </div>
  )
}
