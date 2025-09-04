import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/google/callback`;

// Google's public keys for JWT verification
const GOOGLE_PUBLIC_KEYS_URL = 'https://www.googleapis.com/oauth2/v1/certs';

interface GoogleIDToken {
  iss: string; // issuer
  sub: string; // subject (user ID)
  aud: string; // audience (your client ID)
  exp: number; // expiration time
  iat: number; // issued at
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
}

async function getGooglePublicKeys() {
  const response = await fetch(GOOGLE_PUBLIC_KEYS_URL);
  const keys = await response.json();
  return keys;
}

async function verifyIDToken(idToken: string): Promise<GoogleIDToken> {
  try {
    // Decode the JWT header to get the key ID
    const header = JSON.parse(Buffer.from(idToken.split('.')[0], 'base64').toString());
    const keyId = header.kid;
    
    // Get Google's public keys
    const keys = await getGooglePublicKeys();
    const publicKey = keys[keyId];
    
    if (!publicKey) {
      throw new Error('Public key not found');
    }
    
    // Verify the token
    const decoded = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      audience: GOOGLE_CLIENT_ID,
      issuer: 'https://accounts.google.com'
    }) as GoogleIDToken;
    
    return decoded;
  } catch (error) {
    console.error('ID token verification failed:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  // Validate environment variables
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('Missing Google OAuth credentials');
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/?error=config_missing`);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    // Initial OIDC request - redirect to Google
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&response_mode=query`; // Ensure we get the code in query params
    return NextResponse.redirect(googleAuthUrl);
  }

  try {
    // Exchange code for tokens (including ID token)
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      console.error('Token error details:', tokens);
      throw new Error(tokens.error_description || tokens.error);
    }

    // Verify the ID token (OIDC feature)
    let userInfo: GoogleIDToken;
    if (tokens.id_token) {
      console.log('Using ID token for OIDC authentication');
      userInfo = await verifyIDToken(tokens.id_token);
    } else {
      console.log('No ID token found, falling back to userinfo endpoint');
      // Fallback to userinfo endpoint if no ID token
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      userInfo = await userResponse.json();
    }

    // Set user session cookies and redirect to clean URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const response = NextResponse.redirect(`${baseUrl}/`);
    
    // Set cookies for user session with enhanced OIDC data
    response.cookies.set('user_name', userInfo.name, { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    response.cookies.set('user_email', userInfo.email, { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Store additional OIDC information
    response.cookies.set('user_id', userInfo.sub, { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    response.cookies.set('user_picture', userInfo.picture || '', { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Store email verification status
    response.cookies.set('email_verified', userInfo.email_verified?.toString() || 'false', { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;

  } catch (error) {
    console.error('Google OIDC error:', error);
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
