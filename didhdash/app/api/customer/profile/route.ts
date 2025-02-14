// app/api/customers/profile/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    console.log('Received token:', token); // Debug log

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Forward the request to your Express backend
    const backendResponse = await fetch('http://localhost:3000/api/customers/profile', {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(await request.json())
    });

    const data = await backendResponse.json();
    
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}