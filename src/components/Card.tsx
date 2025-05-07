import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface CardProps {
  title: string
  price: number
  location: string
  image: string
  href: string
  listingId: string
}

export function Card({ title, price, location, image, href, listingId }: CardProps) {
  const { data: session } = useSession()

  const handleAddToCart = async () => {
    if (!session) {
      alert('Faça login para adicionar ao carrinho!')
      return
    }
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, quantity: 1 }),
    })
    if (res.ok) {
      alert('Produto adicionado ao carrinho!')
    } else {
      alert('Erro ao adicionar ao carrinho')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={href} className="block">
        <div className="relative h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-green-600 font-bold mb-2">
            R$ {price.toLocaleString('pt-BR')}
          </p>
          <p className="text-gray-500 text-sm">{location}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  )
} 