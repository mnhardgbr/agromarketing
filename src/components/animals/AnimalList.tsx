'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Animal } from '@prisma/client';

interface AnimalListProps {
  animals: Animal[];
}

export default function AnimalList({ animals }: AnimalListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = !selectedSpecies || animal.species === selectedSpecies;
    return matchesSearch && matchesSpecies;
  });

  const uniqueSpecies = Array.from(new Set(animals.map(animal => animal.species)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas as espécies</option>
            {uniqueSpecies.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map((animal) => (
          <div
            key={animal.id}
            onClick={() => router.push(`/animals/${animal.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            <div className="relative h-48">
              <Image
                src={animal.images[0] || '/placeholder.png'}
                alt={animal.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{animal.name}</h3>
                <span className="text-green-600 font-semibold">
                  R$ {animal.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <p>{animal.species} • {animal.breed}</p>
                <p>{animal.age} anos • {animal.weight}kg</p>
                <p>{animal.location}</p>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{animal.description}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum animal encontrado</p>
        </div>
      )}
    </div>
  );
} 