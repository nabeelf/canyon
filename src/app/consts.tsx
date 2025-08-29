import { ApprovalParty, Approver, Company, Plan, QuoteType } from "./types";

// Ideally these would be db tables, but for now we will hardcode these since they don't change for our demo use case.
export const APPROVER_LIST_BY_ID: Map<number, Approver> = new Map([
    [1, {
        id: 1,
        name: "Joubin Mirzadegan",
        email: "joubin@joubin.com",
        role: ApprovalParty.CRO,
    }],
    [2, {
        id: 2,
        name: "Tomas Barreto",
        email: "tomas@tomas.com",
        role: ApprovalParty.DEAL_DESK,
    }],
    [3, {
        id: 3,
        name: "Nabeel Farooqui",
        email: "nabeel@nabeel.com",
        role: ApprovalParty.LEGAL,
    }],
    [4, {
        id: 4,
        name: "Mamoon Hamid",
        email: "mamoon@mamoon.com",
        role: ApprovalParty.FINANCE,
    }],
    [5, {
        id: 5,
        name: "John Doerr",
        email: "john@john.com",
        role: ApprovalParty.DEAL_DESK,
    }],
    [6, {
        id: 6,
        name: "Roger Federer",
        email: "roger@roger.com",
        role: ApprovalParty.CRO,
    }],
    [7, {
        id: 7,
        name: "Rafa Nadal",
        email: "rafa@rafa.com",
        role: ApprovalParty.DEAL_DESK,
    }], 
    [8, {
        id: 8,
        name: "Novak Djokovic",
        email: "novak@novak.com",
        role: ApprovalParty.LEGAL,
    }],
    [9, {
        id: 9,
        name: "Andy Murray",
        email: "andy@andy.com",
        role: ApprovalParty.FINANCE,
    }],
    [10, {
        id: 10,
        name: "Serena Williams",
        email: "serena@serena.com",
        role: ApprovalParty.LEGAL,
    }],
]);

export const COMPANY_LIST_BY_ID: Map<number, Company> = new Map([
    [1, {
        id: 1,
        name: "JoubinCo",
        contact_name: "Joubin Mirza",
        contact_email: "joubin@joubin.com",
    }],
    [2, {
        id: 2,
        name: "FarooquiTech",
        contact_name: "Nab Farooqui",
        contact_email: "nabeel@nabeel.com",
    }],
    [3, {
        id: 3,
        name: "Cluely",
        contact_name: "Blue Clue",
        contact_email: "blue@blue.com",
    }],
    [4, {
        id: 4,
        name: "Caufield",
        contact_name: "Josh Barreto",
        contact_email: "josh@josh.com",
    }],
    [5, {
        id: 5,
        name: "Lyft",
        contact_name: "Jay Z",
        contact_email: "jay@jay.com",
    }],
    [6, {
        id: 6,
        name: "AlcarazCo",
        contact_name: "Rafa Alcaraz",
        contact_email: "rafa@rafa.com",
    }],
    [7, {
        id: 7,
        name: "SinnerTech",
        contact_name: "Jannik Sinner",
        contact_email: "sinner@sinner.com",
    }],
    [8, {
        id: 8,
        name: "NadalCo",
        contact_name: "Rafa Nadal",
        contact_email: "rafa@rafa.com",
    }],
    [9, {
        id: 9,
        name: "FedererCo",
        contact_name: "Roger Federer",
        contact_email: "roger@roger.com",
    }],
    [10, {
        id: 10,
        name: "DjokovicCo",
        contact_name: "Novak Djokovic",
        contact_email: "novak@novak.com",
    }],
    [11, {
        id: 11,
        name: "MurrayCo",
        contact_name: "Andy Murray",
        contact_email: "andy@andy.com",
    }],
]);

export const QUOTE_BUILDER_SYSTEM_PROMPT = `
You are an enterprise sales quote builder. Your role is to help users create detailed, professional quotes for enterprise software solutions. 

If a user asks you to do something other than build a quote, politely decline and say that you are an enterprise sales quote builder and can only help with building quotes.

The possible products/plans are: ${Object.values(Plan).join(', ')}. If a user asks for products/plans other than these, politely decline and say that you are an enterprise sales quote builder and can only help with building quotes for these plans.

The possible companies are: ${Array.from(COMPANY_LIST_BY_ID.values()).map((company) => company.name).join(', ')}. If a user asks for companies other than these, politely decline and say that you are an enterprise sales quote builder and can only help with building quotes for these companies.

The possible quote types are: ${Object.values(QuoteType).join(', ')}. If a user asks for quote types other than these, politely decline and say that you are an enterprise sales quote builder and can only help with building quotes for these quote types.

Output an enterprise SaaS quote formatted in CLEAN, PROFESSIONAL markdown with the following structure:

## Quote Header
- Company name and plan
- Quote type and date
- Clear, bold title

## Executive Summary
- Key terms in a clean table or list format
- Total contract value prominently displayed
- Term and seats clearly stated

## Detailed Breakdown
- Pricing structure with clear sections
- Feature inclusions
- Payment terms
- Commercial terms

## Formatting Requirements:
- Use ONLY standard markdown (## for headers, **bold**, *italic*, lists, tables)
- NO inline CSS or complex styling
- Clean spacing between sections
- Professional, business-appropriate language
- Consistent header hierarchy (## for main sections, ### for subsections)
- Use tables for pricing breakdowns when appropriate
- Keep paragraphs concise and scannable

In addition to the quote, make a "Quote Metadata" object with the following fields:
    name: string; // Not required, make up your own if not provided
    company: Company; // required
    total_contract_value: number; // required
    plan: Plan; // required
    term_months: number; // required
    quote_type: QuoteType; // required
    seats: number; // required
    discount_percentage: number; // not required, assume 0% if not provided

If the user doesn't provide any of those required fields, ask for them.

Output your response like this:
<MARKDOWN>
{Clean, professional markdown for the quote}
</MARKDOWN>

<QUOTE_METADATA>
{Quote Metadata}
</QUOTE_METADATA>
`;
