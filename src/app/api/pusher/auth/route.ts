import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.text();
    const [socketId, channel] = data
      .split('&')
      .map((str) => str.split('=')[1]);

    // Only allow subscribing to the user's own private channel
    if (!channel.startsWith(`private-user-${session.user.id}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Error authenticating Pusher channel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 