# Maailit

**Easy access to OTP emails for testing**

Maailit is a temporary email service designed specifically for developers who need to test email functionality, OTP verification, password resets, and other email-based workflows without cluttering their personal inboxes.

Live at: [maailit.com](https://maailit.com)

## Features

- **Instant Email Access**: Simply enter a slug and start receiving emails at `yourslug@maailit.com`
- **Real-time Updates**: Emails appear instantly using WebSocket connections
- **Smart CTA Detection**: AI-powered extraction of verification codes and links from emails
- **Auto-cleanup**: Emails are automatically deleted after 15 minutes
- **No Registration Required**: Start using immediately without sign-up

## How It Works

1. Visit [maailit.com](https://maailit.com)
2. Enter your desired email slug (e.g., "test123")
3. Your temporary email address will be `test123@maailit.com`
4. All emails sent to this address will appear in real-time
5. Click on verification codes or links to copy them instantly

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **PartySocket** - Real-time WebSocket connections
- **TanStack Query** - Data fetching and caching
- **Cloudflare Pages** - Deployment

### Backend
- **Hono** - Lightweight web framework
- **Cloudflare Workers** - Serverless execution
- **Cloudflare Email Workers** - Email routing and handling
- **Drizzle ORM** - TypeScript ORM
- **D1 Database** - Serverless SQLite
- **PartyServer** - Real-time pub/sub using Durable Objects
- **OpenAI GPT-4o-mini** - CTA extraction from email content
- **Queues** - Email processing pipeline

## Project Structure

```
maailit/
├── apps/
│   ├── backend/              # Cloudflare Worker backend
│   │   ├── src/
│   │   │   ├── db/          # Database schema and utilities
│   │   │   ├── features/    # CTA detection & real-time updates
│   │   │   ├── router/      # API routes
│   │   │   └── index.ts     # Email handler & queue consumer
│   │   └── migrations/      # Database migrations
│   └── maail-it-web/        # Next.js frontend
│       └── src/
│           ├── app/         # App router pages
│           ├── components/  # React components
│           └── lib/         # Utilities and query hooks
└── playgrounds/             # Development playgrounds
```

## Architecture

1. **Email Reception**: Cloudflare Email Workers receive incoming emails
2. **Parsing**: Emails are parsed using `postal-mime`
3. **Queue Processing**: Emails are queued for async processing
4. **CTA Extraction**: OpenAI analyzes email content to extract verification codes or links
5. **Storage**: Emails are stored in D1 (SQLite) database
6. **Real-time Broadcast**: PartyServer broadcasts new emails to connected clients via WebSockets
7. **Auto-cleanup**: Scheduled worker deletes emails older than 15 minutes

## Development

### Prerequisites
- Node.js 20+
- pnpm 9.1.1+
- Cloudflare account (for deployment)

### Setup

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Deploy to production
pnpm deploy
```

### Environment Variables

Backend requires:
- `OPENAI_API_KEY` - For CTA extraction (optional, falls back to NONE)
- `DB` - D1 database binding
- `EMAIL_QUEUE` - Queue binding
- `RealtimeEmails` - Durable Object binding

## Database

The application uses Cloudflare D1 (SQLite) with the following schema:

```sql
CREATE TABLE email (
  id INTEGER PRIMARY KEY,
  to TEXT NOT NULL,
  from TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  ctaType TEXT NOT NULL, -- 'NONE' | 'CODE' | 'LINK'
  ctaContent TEXT
);
```

Indexes on `to` and `createdAt` for efficient querying.

## API Endpoints

- `POST /test/:email` - Send test email to specified address
- `GET /email/:slug` - Get all emails for a slug

## Contributors

- [@nivekithan](https://github.com/nivekithan) - Backend & Infrastructure
- [@Aayushman](https://github.com/Introfect) - Frontend Development

---

**Note**: This is a testing tool. Do not use for sensitive or production email communications.
