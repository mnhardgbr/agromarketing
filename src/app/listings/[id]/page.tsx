'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ListingImage {
  url: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
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
  reviews: Review[];
}

export default function ListingDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchListing();
    fetchReviews();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}`);
      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const startChat = async () => {
    if (!session?.user?.id) {
      toast.error('Você precisa estar logado para iniciar uma conversa');
      return;
    }

    if (!listing) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          receiverId: listing.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao iniciar conversa');
      }

      const conversation = await response.json();
      router.push(`/chat?conversation=${conversation.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Erro ao iniciar conversa');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Anúncio não encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-square mb-4">
            <Image
              src={listing.images[selectedImage]?.url || '/placeholder.png'}
              alt={listing.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.url}
                    alt={`${listing.title} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
          <p className="text-green-600 text-xl font-semibold mb-4">
            R$ {listing.price.toLocaleString('pt-BR')}
          </p>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Informações do Animal</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p className="font-medium">{listing.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Raça</p>
                  <p className="font-medium">{listing.breed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Idade</p>
                  <p className="font-medium">{listing.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Peso</p>
                  <p className="font-medium">{listing.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Localização</p>
                  <p className="font-medium">{listing.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data do Anúncio</p>
                  <p className="font-medium">
                    {format(new Date(listing.createdAt), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Descrição</h2>
              <p className="text-gray-700">{listing.description}</p>
            </div>

            {listing.veterinaryHistory && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Histórico Veterinário</h2>
                <p className="text-gray-700">{listing.veterinaryHistory}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-2">Vendedor</h2>
              <p className="text-gray-700">{listing.user.name}</p>
            </div>

            <button
              onClick={startChat}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Falar com o Vendedor
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="col-span-2 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Avaliações</h2>
            {session?.user?.id && session.user.id !== listing.user.id && (
              <button
                onClick={() => router.push(`/listings/${params.id}/review`)}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Avaliar Vendedor
              </button>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <div className="relative h-10 w-10">
                      <Image
                        src={review.user.image || '/placeholder.png'}
                        alt={review.user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{review.user.name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-5 w-5 ${
                              index < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {format(new Date(review.createdAt), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma avaliação ainda</p>
          )}
        </div>
      </div>
    </div>
  );
} 