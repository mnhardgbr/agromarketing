'use client'

import { useState, ChangeEvent } from 'react'
import { Card } from '@/components/Card'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'

export default function Equipamentos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const equipamentos = [
    {
      id: '1',
      title: 'Trator John Deere',
      price: 150000,
      location: 'São Paulo, SP',
      image: '/images/equipamentos/trator.jpg',
      category: 'Tratores'
    },
    {
      id: '2',
      title: 'Colheitadeira New Holland',
      price: 280000,
      location: 'Cuiabá, MT',
      image: '/images/equipamentos/colheitadeira.jpg',
      category: 'Colheitadeiras'
    },
    // Adicione mais equipamentos conforme necessário
  ]

  const filters = [
    'Tratores',
    'Colheitadeiras',
    'Implementos',
    'Irrigação',
    'Outros'
  ]

  const filteredEquipamentos = equipamentos.filter(equip => {
    const matchesSearch = equip.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(equip.category)
    return matchesSearch && matchesFilter
  })

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Equipamentos Agrícolas</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-2/3">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar equipamentos..."
          />
        </div>
        <div className="w-full md:w-1/3">
          <FilterBar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipamentos.map((equip) => (
          <Card
            key={equip.id}
            title={equip.title}
            price={equip.price}
            location={equip.location}
            image={equip.image}
            href={`/equipamentos/${equip.id}`}
          />
        ))}
      </div>

      {filteredEquipamentos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum equipamento encontrado.</p>
        </div>
      )}
    </div>
  )
} 