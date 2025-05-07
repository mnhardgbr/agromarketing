'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OrderItem {
  id: string;
  listing: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  createdAt: string;
  items: OrderItem[];
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function SellerOrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/seller/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter.toUpperCase();
  });

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Pedidos</h1>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded ${
              filter === 'paid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pagos
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-4 py-2 rounded ${
              filter === 'shipped'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Enviados
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded ${
              filter === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Entregues
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded ${
              filter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelados
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Pedido #{order.id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PAID">Pago</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregue</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
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
                      <p className="text-sm text-gray-500">
                        Quantidade: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Cliente:</p>
                    <p className="text-sm font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                    <p className="text-sm text-gray-500">{order.user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Endereço de Entrega:</p>
                    <p className="text-sm">
                      {order.shippingAddress}, {order.shippingCity} -{' '}
                      {order.shippingState}
                    </p>
                    <p className="text-sm">CEP: {order.shippingZipCode}</p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <p className="text-sm text-gray-500">Total:</p>
                  <p className="text-lg font-bold">
                    R$ {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 