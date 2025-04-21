'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Animal = {
  id: string
  name: string
  breed: string
  age: string
  price: number
  location: string
  image: string
  category: string
}

const categories = [
  { id: 'bovinos', name: 'Bovinos' },
  { id: 'equinos', name: 'Equinos' },
  { id: 'suinos', name: 'Suínos' },
  { id: 'caprinos', name: 'Caprinos' },
  { id: 'ovinos', name: 'Ovinos' },
]

const breeds = [
  { id: 'nelore', name: 'Nelore' },
  { id: 'angus', name: 'Angus' },
  { id: 'brangus', name: 'Brangus' },
  { id: 'guzera', name: 'Guzerá' },
  { id: 'gir', name: 'Gir' },
]

// Mock data - replace with actual data from your backend
const mockAnimals: Animal[] = [
  {
    id: '1',
    name: 'Touro Nelore',
    breed: 'Nelore',
    age: '3 anos',
    price: 15000,
    location: 'São Paulo, SP',
    image: '/images/bovinos.jpg',
    category: 'bovinos',
  },
  {
    id: '2',
    name: 'Égua Quarto de Milha',
    breed: 'Quarto de Milha',
    age: '5 anos',
    price: 25000,
    location: 'Minas Gerais, MG',
    image: '/images/equinos.jpg',
    category: 'equinos',
  },
  // Add more mock data as needed
]

export default function Animals() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedBreed, setSelectedBreed] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAnimals = mockAnimals.filter((animal) => {
    const matchesCategory = !selectedCategory || animal.category === selectedCategory
    const matchesBreed = !selectedBreed || animal.breed.toLowerCase() === selectedBreed
    const matchesPrice =
      animal.price >= priceRange[0] && animal.price <= priceRange[1]
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesBreed && matchesPrice && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Filtros</h2>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Buscar
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Breed Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Raça
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={selectedBreed}
                    onChange={(e) => setSelectedBreed(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {breeds.map((breed) => (
                      <option key={breed.id} value={breed.id}>
                        {breed.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Faixa de Preço
                  </label>
                  <div className="mt-2 space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>R$ {priceRange[0].toLocaleString()}</span>
                      <span>R$ {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animal Listings */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnimals.map((animal) => (
                  <Link
                    key={animal.id}
                    href={`/animais/${animal.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={animal.image}
                        alt={animal.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {animal.name}
                      </h3>
                      <p className="text-sm text-gray-500">{animal.breed}</p>
                      <p className="text-sm text-gray-500">{animal.age}</p>
                      <p className="text-sm text-gray-500">{animal.location}</p>
                      <p className="mt-2 text-lg font-bold text-green-600">
                        R$ {animal.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 