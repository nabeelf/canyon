import { createClient } from './supabase/server';
import { cookies } from 'next/headers';
import { ApprovalStep, Quote, QuoteDbModel, StepDbModel } from '../types';
import { APPROVER_LIST_BY_ID, COMPANY_LIST_BY_ID } from '../consts';


const mapDbStepToApprovalStep = (step: StepDbModel): ApprovalStep => {
  return {
    id: step.id,
    status: step.status,
    assignee: APPROVER_LIST_BY_ID.get(step.assignee_id)!,
    created_at: step.created_at,
    updated_at: step.updated_at,
    info_requested: step.info_requested,
  };
};

const mapDbQuoteAndStepsToQuote = (quote: QuoteDbModel & {steps: StepDbModel[]}): Quote => {
  const company = COMPANY_LIST_BY_ID.get(quote.company_id)!;
  return {
    id: quote.id,
    created_at: quote.created_at,
    updated_at: quote.updated_at,
    filename: quote.filename,
    name: quote.name,
    company,
    current_step: quote.steps[quote.step_number - 1] ? mapDbStepToApprovalStep(quote.steps[quote.step_number - 1]) : null,
    approvalSteps: quote.steps.map(mapDbStepToApprovalStep),
    step_number: quote.step_number,
    tcv: quote.tcv,
    plan: quote.plan,
    term_months: quote.term_months,
    quote_type: quote.quote_type,
    seats: quote.seats,
    discount_percentage: quote.discount_percentage,
  };
};

// Read all quotes from the database and populate the Quote object with the appropriate steps
export async function readQuotes(): Promise<Quote[]> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('quotes')
      .select(`
          *,
          steps:steps(*)
      `)
      .order('created_at', { ascending: false })
      .order('step_number', { foreignTable: 'steps', ascending: true });

    if (error) {
      console.error('Error reading quotes:', error);
      throw error;
    }

    const quotesAndStepsFromDb: (QuoteDbModel & {steps: StepDbModel[]})[] = data ?? [];
    
    const quotes: Quote[] = quotesAndStepsFromDb.map((quote) => {
      return mapDbQuoteAndStepsToQuote(quote);
    });

    return quotes;
  } catch (error) {
    console.error('Failed to read quotes:', error);
    throw error;
  }
}

// Read a single quote from the database by ID and populate the Quote object with the appropriate steps
export async function readQuoteById(id: number): Promise<Quote | null> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('quotes')
      .select(`
          *,
          steps:steps(*)
      `)
      .eq('id', id)
      .order('step_number', { foreignTable: 'steps', ascending: true })
      .single();

    if (error) {
      console.error('Error reading quote by ID:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    const quoteAndStepsFromDb: QuoteDbModel & {steps: StepDbModel[]} = data;
    return mapDbQuoteAndStepsToQuote(quoteAndStepsFromDb);
  } catch (error) {
    console.error('Failed to read quote by ID:', error);
    throw error;
  }
}

// Create a new quote in the database
export async function createQuote(quoteData: Omit<QuoteDbModel, 'id' | 'created_at' | 'updated_at'>): Promise<QuoteDbModel> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Insert the quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert([{
        id: Date.now(),
        name: quoteData.name,
        company_id: quoteData.company_id,
        tcv: quoteData.tcv,
        plan: quoteData.plan,
        term_months: quoteData.term_months,
        quote_type: quoteData.quote_type,
        seats: quoteData.seats,
        discount_percentage: quoteData.discount_percentage,
        filename: quoteData.filename,
        step_number: quoteData.step_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      throw quoteError;
    }

    return quote;
  } catch (error) {
    console.error('Failed to create quote:', error);
    throw error;
  }
}


// Delete a quote by ID
export async function deleteQuote(id: string): Promise<void> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    // In supabase, we set up cascading deletes for associated steps in the steps table
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete quote:', error);
    throw error;
  }
}

// Update approval flow for a quote
export async function updateApprovalFlow(quoteId: number, approvalSteps: ApprovalStep[]): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Single database call with a transaction using the RPC function (query is at the bottom of the file)
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
      throw new Error('Failed to update approval flow atomically');
    }

    return insertedSteps;
  } catch (error) {
    console.error('Error updating approval flow:', error);
    throw error;
  }
}

// SQL for the update_approval_flow_atomic function (lived in supabase):

// -- Run this in your Supabase SQL editor
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
