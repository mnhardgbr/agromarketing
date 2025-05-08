import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(
  request: Request,
  context: any
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const id = context?.params?.id;

    // Check if listing exists and belongs to user
    const listing = await prisma.listing.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found or unauthorized' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        // Create a unique filename
        const filename = `${id}/${Date.now()}-${image.name}`;
        const storageRef = ref(storage, `listings/${filename}`);

        // Upload the file
        await uploadBytes(storageRef, image);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Save to database
        const savedImage = await prisma.listingImage.create({
          data: {
            url: downloadURL,
            listingId: id,
          },
        });

        return savedImage;
      })
    );

    return NextResponse.json(uploadedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 