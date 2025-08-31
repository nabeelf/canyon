import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    const fileName = searchParams.get('name');
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Download file from storage - append .pdf to the path
    const storagePath = `${filePath}.pdf`;
    const { data, error } = await supabase.storage
      .from('quote-documents')
      .download(storagePath);
    
    if (error) {
      console.error('Storage download error:', error);
      return NextResponse.json(
        { error: 'Failed to download file', details: error.message },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Quote documents can only be pdfs
    const contentType = 'application/pdf';
    const downloadFileName = fileName || filePath.split('/').pop() || 'document';
    
    // Return file as response
    return new Response(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('API Error downloading quote document:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to download document',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, pdfData } = body;
    
    if (!filename || !pdfData) {
      return NextResponse.json(
        { error: 'Filename and PDF data are required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Convert base64 PDF data to buffer
    const pdfBuffer = Buffer.from(pdfData, 'base64');
    
    // Upload document to Supabase storage bucket using server-side client
    // Add .pdf extension to the filename for storage
    const storageFilename = `${filename}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('quote-documents')
      .upload(storageFilename, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload document to storage', details: uploadError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Document uploaded and quote created successfully',
      uploadData 
    });

  } catch (error) {
    console.error('Error creating quote document:', error);
    return NextResponse.json({ error: 'Failed to create quote document' }, { status: 500 });
  }
}
