// app/api/customers/profile/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const body = await request.json();

    // Make sure to forward the token with 'Bearer ' prefix if not present
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    const backendResponse = await fetch('http://localhost:3001/api/customers/profile', {
      method: 'PUT',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update profile', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Add CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export const config = {
  api: {
    bodyParser: true,
  },
};