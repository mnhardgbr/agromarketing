'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const animalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  species: z.string().min(1, 'Espécie é obrigatória'),
  breed: z.string().min(1, 'Raça é obrigatória'),
  age: z.number().min(0, 'Idade deve ser maior que 0'),
  weight: z.number().min(0, 'Peso deve ser maior que 0'),
  price: z.number().min(0, 'Preço deve ser maior que 0'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  location: z.string().min(1, 'Localização é obrigatória'),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AnimalRegistrationFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function AnimalRegistrationForm({ onSubmit, isLoading }: AnimalRegistrationFormProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema)
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleFormSubmit = async (data: AnimalFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (fileInputRef.current?.files) {
      Array.from(fileInputRef.current.files).forEach((file) => {
        formData.append('images', file);
      });
    }

    await onSubmit(formData);
    reset();
    setSelectedImages([]);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Espécie</label>
          <input
            type="text"
            {...register('species')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.species && (
            <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Raça</label>
          <input
            type="text"
            {...register('breed')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.breed && (
            <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Idade (anos)</label>
          <input
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            {...register('weight', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Localização</label>
          <input
            type="text"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Fotos</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar Animal'}
        </button>
      </div>
    </form>
  );
} 