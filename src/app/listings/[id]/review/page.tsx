'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/solid';

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error('Você precisa estar logado para avaliar');
      return;
    }

    if (rating === 0) {
      toast.error('Selecione uma nota');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/listings/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar avaliação');
      }

      toast.success('Avaliação enviada com sucesso!');
      router.push(`/listings/${params.id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Avaliar Vendedor</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nota
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-8 w-8 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comentário (opcional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Conte sua experiência com o vendedor..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </form>
    </div>
  );
} 