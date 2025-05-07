// trigger redeploy
import { notFound } from 'next/navigation';
import Image from 'next/image';
import prisma from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AnimalDetailsPage({ params }: { params: { id: string } }) {
  const animal = await prisma.animal.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: true,
    },
  });

  if (!animal) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.email === animal.user.email;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={animal.images[0] || '/placeholder.png'}
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
              </div>
              {animal.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {animal.images.slice(1).map((image: string, index: number) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${animal.name} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{animal.name}</h1>
                <p className="text-2xl text-green-600 font-semibold">
                  R$ {animal.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Espécie:</span> {animal.species}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Raça:</span> {animal.breed}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Idade:</span> {animal.age} anos
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Peso:</span> {animal.weight}kg
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Localização:</span> {animal.location}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{animal.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Vendedor</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative h-12 w-12">
                    <Image
                      src={animal.user.image || '/placeholder.png'}
                      alt={animal.user.name || 'Vendedor'}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{animal.user.name}</p>
                    <p className="text-sm text-gray-500">{animal.user.email}</p>
                  </div>
                </div>
              </div>

              {!isOwner && (
                <button
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => {/* Implementar chat com vendedor */}}
                >
                  Conversar com o Vendedor
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 