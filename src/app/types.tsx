export enum ApprovalStatus {
    INFO_REQUESTED = "Info Requested",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    PENDING = "Pending",
}

export enum ApprovalParty {
    DEAL_DESK = "Deal Desk",
    CRO = "CRO",
    LEGAL = "Legal",
    FINANCE = "Finance",
}

export enum Plan {
    BASIC = "Basic",
    PRO = "Pro",
    ENTERPRISE = "Enterprise",
}

export enum QuoteType {
    NEW = "New",
    RENEWAL = "Renewal",
    EXPANSION = "Expansion",
}

export type Company = {
    id: number;
    name: string;
    contact_name: string;
    contact_email: string;
}

export type Approver = {
    id: number;
    name: string;
    email: string;
    role: ApprovalParty;
}


export type ApprovalStep = {
    id: number; 
    status: ApprovalStatus;
    assignee: Approver;
    created_at: string;
    updated_at: string;
    info_requested: string | null;
}

export type Quote = {
    id: number;
    created_at: string;
    updated_at: string;
    filename: string;
    name: string;
    company: Company;
    current_step: ApprovalStep | null;
    approvalSteps: ApprovalStep[];
    step_number: number;
    tcv: number;
    plan: Plan;
    term_months: number;
    quote_type: QuoteType;
    seats: number;
}

// DB MODELS
export type QuoteDbModel = {
    id: number;
    created_at: string;
    updated_at: string;
    filename: string;
    name: string;
    company_id: number;
    step_number: number;
    tcv: number;
    plan: Plan;
    term_months: number;
    quote_type: QuoteType;
    seats: number;
}

export type StepDbModel = {
    id: number;
    quote_id: number;
    created_at: string;
    updated_at: string;
    step_number: number;
    status: ApprovalStatus;
    assignee_id: number;
    info_requested: string | null;
}