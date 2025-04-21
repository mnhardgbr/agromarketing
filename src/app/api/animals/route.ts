import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prismadb';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const images = formData.getAll('images') as File[];
    
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
        age: parseInt(formData.get('age') as string),
        weight: parseFloat(formData.get('weight') as string),
        price: parseFloat(formData.get('price') as string),
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        images: imageUrls,
        userId: session.user.email,
      },
    });

    return NextResponse.json(animal);
  } catch (error) {
    console.error('Error creating animal:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 