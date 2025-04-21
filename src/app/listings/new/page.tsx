'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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

export default function NewListing() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error('Você precisa estar logado para criar um anúncio');
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      breed: formData.get('breed'),
      age: formData.get('age'),
      weight: formData.get('weight'),
      price: formData.get('price'),
      location: formData.get('location'),
      veterinaryHistory: formData.get('veterinaryHistory'),
      userId: session.user.id,
    };

    try {
      // First, create the listing
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar anúncio');
      }

      const listing = await response.json();

      // Then, upload images
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((image) => {
          imageFormData.append('images', image);
        });

        const uploadResponse = await fetch(`/api/listings/${listing.id}/images`, {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Erro ao fazer upload das imagens');
        }
      }

      toast.success('Anúncio criado com sucesso!');
      router.push(`/listings/${listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Erro ao criar anúncio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Anúncio</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos do Animal
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título do Anúncio
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Category and Breed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Selecione uma categoria</option>
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Age and Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Idade
            </label>
            <input
              type="text"
              id="age"
              name="age"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Peso (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Price and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Preço (R$)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Veterinary History */}
        <div>
          <label htmlFor="veterinaryHistory" className="block text-sm font-medium text-gray-700">
            Histórico Veterinário
          </label>
          <textarea
            id="veterinaryHistory"
            name="veterinaryHistory"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando...' : 'Criar Anúncio'}
          </button>
        </div>
      </form>
    </div>
  );
} 