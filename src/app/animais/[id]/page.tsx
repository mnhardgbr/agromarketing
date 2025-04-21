'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Mock data - replace with actual data from your backend
const mockAnimal = {
  id: '1',
  name: 'Touro Nelore',
  breed: 'Nelore',
  age: '3 anos',
  price: 15000,
  location: 'São Paulo, SP',
  images: [
    '/images/bovinos.jpg',
    '/images/bovinos2.jpg',
    '/images/bovinos3.jpg',
  ],
  description: 'Touro Nelore de excelente qualidade, com pedigree e histórico de premiações. Peso aproximado de 800kg.',
  characteristics: [
    'Peso: 800kg',
    'Altura: 1.45m',
    'Pelagem: Branca',
    'Chifres: Médias',
  ],
  health: [
    'Vacinado',
    'Vermifugado',
    'Com histórico veterinário completo',
  ],
  seller: {
    name: 'Fazenda Boi Gordo',
    rating: 4.8,
    reviews: 42,
    phone: '(11) 99999-9999',
    email: 'contato@fazendaboigordo.com.br',
  },
}

export default function AnimalDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement message sending logic
    alert('Mensagem enviada com sucesso!')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{mockAnimal.name}</h1>
                  <p className="mt-1 text-sm text-gray-500">{mockAnimal.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    R$ {mockAnimal.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Gallery */}
                  <div>
                    <div className="relative h-96 rounded-lg overflow-hidden">
                      <Image
                        src={mockAnimal.images[selectedImage]}
                        alt={mockAnimal.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {mockAnimal.images.map((image, index) => (
                        <button
                          key={index}
                          className={`relative h-20 rounded-lg overflow-hidden ${
                            selectedImage === index ? 'ring-2 ring-green-500' : ''
                          }`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <Image
                            src={image}
                            alt={`${mockAnimal.name} - Foto ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Entre em contato com o vendedor
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Mensagem
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua mensagem aqui..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Enviar mensagem
                        </button>
                      </form>
                    </div>

                    {/* Seller Info */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Informações do Vendedor
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{mockAnimal.seller.name}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(mockAnimal.seller.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            ({mockAnimal.seller.reviews} avaliações)
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Telefone:</span>{' '}
                            {mockAnimal.seller.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Email:</span>{' '}
                            {mockAnimal.seller.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animal Details */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Detalhes do Animal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                      <p className="text-gray-500">{mockAnimal.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Características</h4>
                      <ul className="list-disc list-inside text-gray-500">
                        {mockAnimal.characteristics.map((char, index) => (
                          <li key={index}>{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Saúde</h4>
                      <ul className="list-disc list-inside text-gray-500">
                        {mockAnimal.health.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 