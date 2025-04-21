'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ListingImage {
  url: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  breed: string;
  age: string;
  weight: number;
  price: number;
  location: string;
  veterinaryHistory: string;
  createdAt: string;
  user: User;
  images: ListingImage[];
}

interface AnimalCategory {
  id: string;
  name: string;
}

const categories: AnimalCategory[] = [
  { id: 'bovinos', name: 'Bovinos' },
  { id: 'equinos', name: 'Equinos' },
  { id: 'suinos', name: 'Suínos' },
  { id: 'caprinos', name: 'Caprinos' },
  { id: 'ovinos', name: 'Ovinos' },
  { id: 'aves', name: 'Aves' },
  { id: 'outros', name: 'Outros' },
];

export default function Listings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
    breed: searchParams.get('breed') || '',
  });

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const fetchListings = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.breed) queryParams.append('breed', filters.breed);

      const response = await fetch(`/api/listings?${queryParams.toString()}`);
      const data = await response.json();
      setListings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.breed) queryParams.append('breed', filters.breed);

    router.push(`/listings?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
              Raça
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={filters.breed}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Localização
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
              Preço Mínimo
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
              Preço Máximo
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/listings/${listing.id}`)}
          >
            <div className="relative aspect-video">
              <Image
                src={listing.images[0]?.url || '/placeholder.png'}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.breed}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-semibold">
                  R$ {listing.price.toLocaleString('pt-BR')}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(listing.createdAt), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum anúncio encontrado</p>
        </div>
      )}
    </div>
  );
} 