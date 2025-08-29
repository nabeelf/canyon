import { NextRequest, NextResponse } from 'next/server';
import { updateApprovalFlow } from '@/app/utils/db_server_utils';

export async function PUT(request: NextRequest) {
  try {
    const { quoteId, approvalSteps } = await request.json();

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    if (!approvalSteps || !Array.isArray(approvalSteps)) {
      return NextResponse.json(
        { error: 'Invalid approval steps data' },
        { status: 400 }
      );
    }

    const insertedSteps = await updateApprovalFlow(quoteId, approvalSteps);

    return NextResponse.json({
      success: true,
      data: insertedSteps,
      message: 'Approval flow updated successfully'
    });

  } catch (error) {
    console.error('Error updating approval flow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
