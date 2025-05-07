import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
}

interface ReviewsProps {
  listingId: string;
}

export default function Reviews({ listingId }: ReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?listingId=${listingId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prev) => [newReview, ...prev]);
        setShowForm(false);
        setRating(5);
        setComment('');
      }
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      const response = await fetch(`/api/reviews/${editingReview}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews((prev) =>
          prev.map((review) =>
            review.id === editingReview ? updatedReview : review
          )
        );
        setEditingReview(null);
        setShowForm(false);
        setRating(5);
        setComment('');
      }
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      }
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review.id);
    setRating(review.rating);
    setComment(review.comment || '');
    setShowForm(true);
  };

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Avaliações</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({reviews.length} avaliações)
            </span>
          </div>
        </div>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Escrever Avaliação
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={editingReview ? handleEdit : handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comentário
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingReview(null);
                setRating(5);
                setComment('');
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingReview ? 'Atualizar' : 'Enviar'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative h-10 w-10">
                  <Image
                    src={review.user.image || '/placeholder.png'}
                    alt={review.user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{review.user.name}</h4>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {session?.user?.email === review.user.email && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(review)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            {review.comment && (
              <p className="mt-4 text-gray-600">{review.comment}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 