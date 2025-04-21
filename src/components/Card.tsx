import Image from 'next/image'
import Link from 'next/link'

interface CardProps {
  title: string
  price: number
  location: string
  image: string
  href: string
}

export function Card({ title, price, location, image, href }: CardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
      </div>
    </Link>
  )
} 