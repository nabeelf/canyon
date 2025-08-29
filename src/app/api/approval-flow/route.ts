import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';

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

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Single database call with a transaction. The SQL for this call is at the bottom of the file.
    const { data: insertedSteps, error: transactionError } = await supabase
      .rpc('update_approval_flow_atomic', {
        p_quote_id: quoteId,
        p_approval_steps: approvalSteps.map((step, index) => ({
          step_number: index + 1,
          status: step.status,
          assignee_id: step.assignee.id,
          created_at: step.created_at,
          updated_at: step.updated_at
        }))
      });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      return NextResponse.json(
        { error: 'Failed to update approval flow atomically' },
        { status: 500 }
      );
    }

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


// update_approval_flow_atomic SQL Query (lives in Supabase console):

// CREATE OR REPLACE FUNCTION update_approval_flow_atomic(
//   p_quote_id BIGINT,
//   p_approval_steps JSONB
// )
// RETURNS JSONB
// LANGUAGE plpgsql
// AS $$
// DECLARE
//   v_step JSONB;
//   v_inserted_steps JSONB := '[]'::JSONB;
//   v_step_record RECORD;
// BEGIN
//   -- Start transaction (PostgreSQL automatically starts one)
  
//   -- Delete all existing steps for this quote
//   DELETE FROM steps WHERE quote_id = p_quote_id;
  
//   -- Insert new approval steps
//   FOR v_step IN SELECT * FROM jsonb_array_elements(p_approval_steps)
//   LOOP
//     INSERT INTO steps (
//       quote_id,
//       step_number,
//       status,
//       assignee_id,
//       created_at,
//       updated_at
//     ) VALUES (
//       p_quote_id,
//       (v_step->>'step_number')::INTEGER,
//       (v_step->>'status')::TEXT,
//       (v_step->>'assignee_id')::BIGINT,
//       (v_step->>'created_at')::TIMESTAMP,
//       (v_step->>'updated_at')::TIMESTAMP
//     ) RETURNING * INTO v_step_record;
    
//     -- Add the inserted step to our result
//     v_inserted_steps := v_inserted_steps || jsonb_build_object(
//       'id', v_step_record.id,
//       'quote_id', v_step_record.quote_id,
//       'step_number', v_step_record.step_number,
//       'status', v_step_record.status,
//       'assignee_id', v_step_record.assignee_id,
//       'created_at', v_step_record.created_at,
//       'updated_at', v_step_record.updated_at
//     );
//   END LOOP;
  
//   -- If we get here, all operations succeeded
//   -- PostgreSQL will automatically commit the transaction
//   RETURN v_inserted_steps;
  
// EXCEPTION
//   WHEN OTHERS THEN
//     -- PostgreSQL will automatically rollback the transaction on any error
//     RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
// END;
// $$;
