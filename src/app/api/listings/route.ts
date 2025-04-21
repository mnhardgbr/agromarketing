import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage } from '@/lib/uploadImage'

// Get all listings with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const breed = searchParams.get('breed')

    const where: any = {
      status: 'ACTIVE',
    }

    if (category) {
      where.category = category
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    if (breed) {
      where.breed = {
        contains: breed,
        mode: 'insensitive',
      }
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new listing
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse the FormData
    const formData = await request.formData()
    
    // Get the files
    const images = formData.getAll('images') as File[]
    
    // Upload images and get their URLs
    const imageUrls = await Promise.all(
      images.map(image => uploadImage(image))
    )

    // Create the listing with images
    const listing = await prisma.listing.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        breed: formData.get('breed') as string,
        age: formData.get('age') as string,
        weight: parseFloat(formData.get('weight') as string),
        price: parseFloat(formData.get('price') as string),
        location: formData.get('location') as string,
        veterinaryHistory: formData.get('veterinaryHistory') as string,
        userId: user.id,
        images: {
          create: imageUrls.map(url => ({
            url
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true
      },
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 