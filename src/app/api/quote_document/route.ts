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
    
    // Determine content type based on file extension
    const getContentType = (path: string) => {
      const ext = path.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'pdf': return 'application/pdf';
        case 'doc': return 'application/msword';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'xls': return 'application/vnd.ms-excel';
        case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'txt': return 'text/plain';
        case 'csv': return 'text/csv';
        default: return 'application/octet-stream';
      }
    };
    
    const contentType = getContentType(storagePath);
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
