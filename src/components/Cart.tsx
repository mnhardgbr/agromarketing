import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  listing: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchCart();
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (listingId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice = cart?.items.reduce((acc, item) => acc + (item.listing.price * item.quantity), 0) || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Carrinho</h3>
            {loading ? (
              <p>Carregando...</p>
            ) : cart?.items.length ? (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative h-20 w-20">
                        <Image
                          src={item.listing.images[0] || '/placeholder.png'}
                          alt={item.listing.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.listing.title}</h4>
                        <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                        <p className="text-sm font-medium">
                          R$ {(item.listing.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.listing.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">Seu carrinho está vazio</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 