import { NextRequest, NextResponse } from 'next/server';
import { getPodcastById, deletePodcast } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const podcast = await getPodcastById(resolvedParams.id);
    
    if (!podcast) {
      return NextResponse.json(
        { error: 'Podcast not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error fetching podcast:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcast' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userEmail = session.user.email;
    const resolvedParams = await params;
    const podcastId = resolvedParams.id;
    
    // Delete the podcast with user verification
    const result = await deletePodcast(podcastId, userEmail);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      const statusCode = result.message.includes('Unauthorized') ? 403 : 
                        result.message.includes('not found') ? 404 : 500;
      
      return NextResponse.json(
        { error: result.message },
        { status: statusCode }
      );
    }
  } catch (error) {
    console.error('Error deleting podcast:', error);
    return NextResponse.json(
      { error: 'Failed to delete podcast' },
      { status: 500 }
    );
  }
}
