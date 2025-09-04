# Canyon - Enterprise Quote Management System

Canyon is a modern, AI-powered enterprise quote management application built with Next.js 15, TypeScript, and Supabase. It streamlines the quote creation, approval, and management process for enterprise sales teams with drag-and-drop workflows and AI-powered quote generation.

## 🚀 Features

### Core Functionality
- **AI-Powered Quote Builder**: GPT-5 powered quote generation with natural language input
- **Quote Management**: Complete CRUD operations for enterprise quotes
- **Approval Workflows**: Configurable multi-step approval processes with role-based access
- **Document Management**: Advanced PDF generation with custom styling and metadata
- **Company Management**: Enterprise company and contact management
- **Dashboard Analytics**: Real-time metrics and approval time tracking

### Technical Features
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: Live data synchronization
- **Role-based Access**: Approval party and role management
- **File Storage**: Secure PDF storage with Supabase Storage
- **Authentication**: Google OIDC (OpenID Connect) SSO integration [this can later be changed to SAML for higher-grade security]
- **Drag-and-Drop**: Interactive approval step reordering

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS + Shadcn UI
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and local state
- **PDF Generation**: Puppeteer with @sparticuz/chromium for Vercel compatibility

### Backend
- **API Routes**: Next.js API routes for backend logic
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Storage**: Supabase Storage for PDF documents
- **Authentication**: Google SSO (OpenID Connect) with JWT verification
- **AI Integration**: OpenAI GPT-5 API for quote generation

## 🔐 Authentication & Security

### Google OIDC (OpenID Connect) SSO Implementation

Canyon uses **Google OIDC (OpenID Connect)** for secure Single Sign-On authentication, providing enterprise-grade security with modern JWT-based identity verification.

#### **OIDC Features**
- **JWT Token Verification**: Cryptographically verifies Google's ID tokens using RS256 signatures
- **Rich User Data**: Extracts verified user information including email verification status, profile pictures, and unique user IDs
- **Secure Session Management**: Enhanced cookie-based sessions with OIDC claims
- **Fallback Support**: Graceful fallback to OAuth 2.0 userinfo endpoint if ID tokens are unavailable

#### **Authentication Flow**
1. **User clicks "Continue with Google"** → Redirects to Google OAuth consent screen
2. **Google sends ID token** → JWT containing user data with cryptographic signature
3. **App verifies JWT** → Validates signature using Google's public keys
4. **User data extracted** → Rich user information from verified token
5. **Session established** → Secure cookies with OIDC user data

#### **OIDC User Data**
```typescript
interface GoogleIDToken {
  iss: string;        // Issuer (Google)
  sub: string;        // Unique user ID
  aud: string;        // Audience (your app)
  exp: number;        // Expiration time
  iat: number;        // Issued at
  email: string;       // User email
  email_verified: boolean; // Email verification status
  name: string;       // Full name
  picture: string;    // Profile picture URL
  given_name: string; // First name
  family_name: string; // Last name
  locale: string;     // User locale
}
```

#### **Security Benefits**
- **Cryptographic Verification**: Validates token signatures using Google's public keys
- **Tamper Protection**: Ensures user data hasn't been modified
- **Expiration Handling**: Automatic token expiration validation
- **Audience Validation**: Verifies tokens are intended for your application
- **Issuer Verification**: Confirms tokens come from Google

#### **Environment Variables**
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

### Database Schema
```sql
-- Core tables
quotes: Quote information and metadata
steps: Approval workflow steps
companies: Company details and contacts [does not need to change for demo purposes, currently a static list in memory]
users: User authentication and roles [does not need to change for demo purposes, currently a static list in memory]

-- Key relationships
quotes.company_id -> companies.id
steps.quote_id -> quotes.id
steps.assignee_id -> users.id
```

## 🧠 Complex Logic Explained

### 1. Drag-and-Drop Approval Workflow (`QuoteDetails.tsx`)

The approval workflow system implements a sophisticated drag-and-drop interface for reordering approval steps. Here's how it works:

#### **State Management**
```typescript
// Local state for managing approval steps
const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>(quote.approvalSteps);
const [isDragging, setIsDragging] = useState(false);
```

#### **Drag-and-Drop Logic**
1. **Drag Start**: When a user starts dragging an approval step
   - Sets `isDragging` to true
   - Stores the dragged item's index
   - Applies visual feedback (opacity changes, cursor changes)

2. **Drag Over**: As the user drags over other steps
   - Calculates the target position
   - Determines if the step should move up or down
   - Updates the visual order without committing changes

3. **Drop**: When the user releases the drag
   - Reorders the approval steps array
   - Updates step numbers sequentially (1, 2, 3, etc.)
   - Sends the new order to the backend via API
   - Updates the database with the new workflow

#### **Drag Restrictions**
The drag-and-drop system implements smart restrictions to maintain workflow integrity:

- **Current Step Only**: Only the current step (where `step_number` equals the quote's current step) can be dragged
- **Pending Status Required**: Only steps with "pending" status are draggable
- **Approved/Rejected Lock**: Steps that have been approved or rejected cannot be reordered
- **Sequential Workflow**: This ensures the approval process follows a logical sequence without disrupting completed approvals

```typescript
// Example of drag restriction logic
const canDragStep = (step: ApprovalStep, currentStepNumber: number) => {
  return step.step_number === currentStepNumber && step.status === 'pending';
};

// Visual feedback for non-draggable steps
const getDragHandleProps = (step: ApprovalStep) => {
  const isDraggable = canDragStep(step, quote.step_number);
  return {
    cursor: isDraggable ? 'grab' : 'not-allowed',
    opacity: isDraggable ? 1 : 0.5,
    // Disable drag events for non-draggable steps
    onMouseDown: isDraggable ? handleDragStart : undefined,
  };
};
```

#### **Backend Synchronization**
```typescript
// Atomic database update using Supabase RPC
const { data: insertedSteps, error: transactionError } = await supabase
  .rpc('update_approval_flow_atomic', {
    p_quote_id: quoteId,
    p_approval_steps: approvalSteps.map((step, index) => ({
      step_number: index + 1,  // Sequential numbering
      status: step.status,
      assignee_id: step.assignee.id,
      created_at: step.created_at,
      updated_at: step.updated_at
    }))
  });
```

#### **Visual Feedback**
- **Drag Preview**: Shows a ghost image of the dragged item
- **Drop Zones**: Highlights potential drop locations
- **Smooth Animations**: CSS transitions for step reordering
- **Status Indicators**: Visual feedback for drag state
- **Disabled States**: Non-draggable steps are visually dimmed and show "not-allowed" cursor

### 2. PDF Generation System (`generate-pdf/route.ts`)

The PDF generation system uses Puppeteer to convert markdown content into professionally styled PDFs with custom metadata.

#### **HTML Template Generation**
```typescript
const createPDFHTML = async (markdownContent: string, quoteMetadata: QuoteMetadata | null): Promise<string> => {
  const cleanMarkdown = markdownContent.trim();
  const html = await marked(cleanMarkdown);  // Convert markdown to HTML

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        /* Custom CSS for professional PDF styling */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
          font-size: 11px;
          line-height: 1.5;
          color: #1a202c;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
        }
        
        /* Additional styling for tables, code blocks, etc. */
      </style>
    </head>
    <body>
      <div class="document-container">
        ${quoteMetadata ? `
          <div class="header">
            <div class="title">${quoteMetadata.name}</div>
            <div class="metadata-grid">
              <div class="metadata-item">
                <span class="metadata-label">Company</span>
                <span class="metadata-value">${quoteMetadata.company.name}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Total Contract Value</span>
                <span class="metadata-value">$${quoteMetadata.tcv?.toLocaleString()}</span>
              </div>
              <!-- Additional metadata fields -->
            </div>
          </div>
        ` : ''}
        <div class="content">
          ${html}
        </div>
      </div>
    </body>
    </html>
  `;
};
```

#### **Puppeteer Configuration**
Use @sparticuz/chromium and puppeteer-core as Puppeteer configuration to not bloat the bundle size of the Vercel serverless function:

```typescript
const chromium = (await import("@sparticuz/chromium")).default;
puppeteer = await import("puppeteer-core");

launchOptions = {
  ...launchOptions,
  args: chromium.args,
  executablePath: await chromium.executablePath(),
};
```

#### **PDF Generation Process happens server-side to ensure high-quality markdown to PDF conversion**
1. **Content Processing**: LLM-generated markdown content is converted to HTML using the `marked` library
2. **Template Injection**: HTML is injected into a custom template with metadata
3. **Browser Launch**: Puppeteer launches a headless browser
4. **Page Setup**: HTML content is set on a new page
5. **PDF Generation**: Page is converted to PDF with custom settings
6. **Cleanup**: Browser is closed and PDF is returned

### 3. AI-Powered Quote Builder (`CreateQuote.tsx`)

The AI quote builder uses GPT-5 to generate structured quote data from natural language input.

#### **Chat Interface**
```typescript
const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [markdownContent, setMarkdownContent] = useState<string>("");
const [quoteMetadata, setQuoteMetadata] = useState<QuoteMetadata | null>(null);
```

#### **Response Parsing**
The AI response contains structured data wrapped in XML-like tags, so we can parse out information and deterministically construct responses when needed:

```typescript
const parseResponse = (content: string) => {
  // Extract markdown content between <MARKDOWN> tags
  const markdownMatch = content.match(/<MARKDOWN>([\s\S]*?)<\/MARKDOWN>/);
  if (markdownMatch) {
    const markdown = markdownMatch[1].trim();
    setMarkdownContent(markdown);
  }

  // Extract quote metadata between <QUOTE_METADATA> tags
  const metadataMatch = content.match(/<QUOTE_METADATA>([\s\S]*?)<\/QUOTE_METADATA>/);
  if (metadataMatch) {
    try {
      const metadataJson = metadataMatch[1].trim();
      const metadata = JSON.parse(metadataJson);
      
      // Find company by name and replace with full company object
      const companyEntry = Array.from(COMPANY_LIST_BY_ID.values())
        .find((c) => c.name === metadata.company);
      if (!companyEntry) {
        throw new Error('Company not found');
      }
      
      metadata.company = companyEntry;
      setQuoteMetadata(metadata);
    } catch (err) {
      console.error('Failed to parse quote metadata:', err);
    }
  }
};
```

#### **PDF Generation Integration**
```typescript
const createPDFBlob = async (): Promise<Blob | null> => {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        markdownContent,
        quoteMetadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    return null;
  }
};
```

### 4. Database Operations with Error Handling (`db_server_utils.tsx`)

This function is a wrapper to access the database. These database utilities implement atomic SQL queries and robust error handling for data mapping operations.

#### **Graceful Error Handling**
```typescript
const quotes: Quote[] = quotesAndStepsFromDb.map((quote) => {
  try {
    return mapDbQuoteAndStepsToQuote(quote);
  } catch (error) {
    console.error(`Error mapping quote ${quote.id}:`, error);
    // Skip quotes that can't be mapped due to missing data
    return null;
  }
}).filter((quote): quote is Quote => quote !== null);
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- OpenAI API key
- Google OAuth credentials

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd canyon
npm install
```

### 2. Environment Configuration
Create `.env.local` with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application URLs (Production)
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback

# Optional: Vercel auto-detection
VERCEL_URL=https://yourdomain.com
```

### 3. Database Setup
Run the following SQL in your Supabase SQL editor:

```sql
-- Create tables
CREATE TABLE quotes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company_id BIGINT REFERENCES companies(id),
  tcv DECIMAL(15,2),
  plan TEXT,
  term_months INTEGER,
  quote_type TEXT,
  seats INTEGER,
  discount_percentage DECIMAL(5,2),
  filename TEXT,
  step_number INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE steps (
  id BIGSERIAL PRIMARY KEY,
  quote_id BIGINT REFERENCES quotes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  assignee_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quote-documents', 'quote-documents', false);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Key Components

### AI Quote Builder (`CreateQuote.tsx`)
- **Natural Language Input**: Users describe quotes in plain English
- **GPT-5 Integration**: OpenAI API processes requests and generates structured data
- **PDF Generation**: Automatic PDF creation with metadata extraction
- **Chat Interface**: Interactive conversation with AI assistant
- **Quote Storage**: Saves quotes to database with PDF upload

### Approval Workflow (`QuoteDetails.tsx`)
- **Multi-step Approval**: Configurable approval steps with role assignment
- **Drag-and-Drop Reordering**: Interactive step reordering with visual feedback
- **Status Tracking**: Real-time status updates (pending, approved, rejected)
- **Role-based Access**: Different approval parties (Sales, Legal, Finance)
- **Workflow Management**: Add, edit, and reorder approval steps

### Dashboard (`HomeLoggedIn.tsx`)
- **Approval Time Charts**: Bar charts showing approval times by role
- **Quote Distribution**: Pie charts for approval stages and role distribution
- **Performance Metrics**: Key stats including pipeline values and close times
- **Real-time Data**: Live updates from database

### Data Management (`DataTable.tsx`)
- **Sortable Columns**: Sort by any quote attribute
- **Filtering**: Search and filter quotes
- **Pagination**: Efficient data loading
- **Actions**: View details, download PDFs, manage quotes

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth flow

### Quote Management
- `GET /api/quotes` - Retrieve all quotes
- `POST /api/quotes` - Create new quote
- `PUT /api/quotes/[id]` - Update quote
- `DELETE /api/quotes/[id]` - Delete quote

### Document Management
- `GET /api/quote_document` - Download PDF documents
- `POST /api/quote_document` - Upload PDF documents
- `POST /api/generate-pdf` - Generate PDF from markdown content

### AI Integration
- `POST /api/create-completion` - OpenAI GPT-5 completions

### Approval Workflows
- `PUT /api/approval-flow` - Update approval workflow

## 🎨 UI Components

### Shadcn UI Integration
- **Cards**: Information display and organization
- **Buttons**: Consistent button styling and variants
- **Tables**: Data presentation with sorting and filtering
- **Forms**: Input validation and user interaction
- **Modals**: Overlay dialogs and confirmations

### Custom Components
- **PageHeader**: Reusable page headers with gradients
- **StatusPill**: Approval status indicators
- **Charts**: Data visualization with Recharts
- **Sidebar**: Navigation with role-based access
- **ApprovalFlowList**: Drag-and-drop approval step management

## 🔐 Security Features

### Row Level Security (RLS)
- **Database-level Security**: Supabase RLS policies
- **User Isolation**: Users can only access their data
- **Role-based Access**: Different permissions for different roles

### Authentication
- **Google OAuth**: Secure third-party authentication
- **Session Management**: Secure cookie-based sessions
- **Environment Variables**: Sensitive data in environment

## 📊 Data Flow

### Quote Creation Flow
1. **User Input**: Natural language description in AI builder
2. **AI Processing**: GPT-5 generates structured quote data
3. **PDF Generation**: HTML to PDF conversion with metadata
4. **Storage Upload**: PDF uploaded to Supabase Storage
5. **Database Insert**: Quote record created in database
6. **Confirmation**: Success message with next steps

### Approval Workflow Flow
1. **Quote Creation**: Quote created with initial step number
2. **Workflow Setup**: Admin configures approval steps
3. **Drag-and-Drop Reordering**: Interactive step reordering
4. **Step Assignment**: Roles assigned to each step
5. **Approval Process**: Sequential approval through steps
6. **Status Updates**: Real-time status tracking
7. **Completion**: Quote approved or rejected

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
- Set all required environment variables in Vercel dashboard
- Ensure `NEXTAUTH_URL` points to your production domain
- Configure Google OAuth redirect URIs for production

### Custom Domain
1. Add custom domain in Vercel
2. Set `NEXTAUTH_URL` to your custom domain
3. Update Google OAuth redirect URIs
4. Configure DNS records

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks

### Testing
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User flow testing with Playwright

## 🔍 Troubleshooting

### Common Issues
1. **Supabase Connection**: Check environment variables and network access
2. **Google OAuth**: Verify redirect URIs and client credentials
3. **PDF Generation**: Ensure all dependencies are installed
4. **Storage Access**: Check bucket permissions and RLS policies
5. **Drag-and-Drop**: Verify browser compatibility and event handling

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=* npm run dev
```

## 📈 Performance

### Optimization Features
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Static site generation where possible
- **API Caching**: Intelligent API response caching
- **Puppeteer Optimization**: Lightweight @sparticuz/chromium for Vercel


---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
