export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    console.log('Recebido cadastro:', request);

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData() as any;
    const images = formData.getAll('images') as unknown as File[];

    // Validação de campos obrigatórios
    const requiredFields = ['name', 'species', 'breed', 'age', 'weight', 'price', 'description', 'location'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return new NextResponse(`Campo obrigatório faltando: ${field}`, { status: 400 });
      }
    }

    // Buscar o id do usuário pelo email
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return new NextResponse('Usuário não encontrado', { status: 404 });
    }

    // Upload images to Firebase Storage
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(storage, `animals/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        return getDownloadURL(snapshot.ref);
      })
    );

    // Create animal in database
    const animal = await prisma.animal.create({
      data: {
        name: formData.get('name') as string,
        species: formData.get('species') as string,
        breed: formData.get('breed') as string,
        age: Number(formData.get('age')),
        weight: Number(formData.get('weight')),
        price: Number(formData.get('price')),
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        images: imageUrls,
        userId: user.id,
      },
    });

    console.log('Resposta do cadastro:', animal);

    return NextResponse.json(animal);
  } catch (error) {
    console.error('Error creating animal:', error);
    return new NextResponse(
      process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error',
      { status: 500 }
    );
  }
} 