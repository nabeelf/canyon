import { NextRequest, NextResponse } from 'next/server';
import { createQuote, readQuotes, readQuoteById, deleteQuote } from '../../utils/db_server_utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Validate that id is a valid number
      const numericId = Number(id);
      if (isNaN(numericId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid quote ID format'
          },
          { status: 400 }
        );
      }
      
      // Fetch single quote by ID
      const quote = await readQuoteById(numericId);
      
      if (!quote) {
        return NextResponse.json(
          {
            success: false,
            error: 'Quote not found'
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(quote);
    }
    
    // Fetch all quotes
    const quotes = await readQuotes();
    
    return NextResponse.json({
      success: true,
      data: quotes,
      count: quotes.length
    });
  } catch (error) {
    console.error('API Error reading quotes:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quotes',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quote ID is required'
        },
        { status: 400 }
      );
    }

    await deleteQuote(id);
    
    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    console.error('API Error deleting quote:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete quote',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    
    // Create quote in database
    await createQuote(body);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
