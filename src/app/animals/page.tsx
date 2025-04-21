import Link from 'next/link';
import prisma from '@/lib/prismadb';
import AnimalList from '@/components/animals/AnimalList';

export default async function AnimalsPage() {
  const animals = await prisma.animal.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Animais Disponíveis</h1>
        <Link
          href="/animals/register"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Cadastrar Animal
        </Link>
      </div>
      <AnimalList animals={animals} />
    </div>
  );
} 