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
    company: company,
    current_step: quote.steps[quote.step_number - 1] ? mapDbStepToApprovalStep(quote.steps[quote.step_number - 1]) : null,
    approvalSteps: quote.steps.map(mapDbStepToApprovalStep),
    step_number: quote.step_number,
    tcv: quote.tcv,
    plan: quote.plan,
    term_months: quote.term_months,
    quote_type: quote.quote_type,
    seats: quote.seats,
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

// Read a single quote by ID
export async function readQuoteById(id: string): Promise<Quote | null> {
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
      .single();

    if (error) {
      console.error('Error reading quote by ID:', error);
      throw error;
    }

    const quoteAndStepsFromDb: (QuoteDbModel & {steps: StepDbModel[]}) = data ?? null;
    if (quoteAndStepsFromDb) {
      return mapDbQuoteAndStepsToQuote(quoteAndStepsFromDb);
    }

    return null;
  } catch (error) {
    console.error('Failed to read quote by ID:', error);
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
