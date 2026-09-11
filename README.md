# MESSAGER — Privacy-Focused Communication ID Messaging Platform

A modern, responsive, real-time messaging application where identity is anchored to a permanent, server-generated **8-digit Communication ID** rather than personal phone numbers or email addresses.

---

## Key Features

- 🔐 **Privacy-First Communication ID**: Identity is an unpredictable, server-generated 8-digit number (e.g. `58392147`). Your email and phone number are never shared.
- ⚡ **Google Authentication & Strict Account Separation**: Google OAuth for authentication, with zero data bleed between multiple accounts on logout / sign-in.
- 💬 **Rich Real-Time Chat**: 1-to-1 conversations, realtime typing indicators, online presence, delivered/read receipts, emoji reactions, message replies, edits, deletions, and media attachments.
- 💭 **Thoughts (24h Ephemeral Status)**: 24-hour expiring status updates with customizable gradient themes and granular audience controls (Everyone, Contacts, Close Friends).
- 🔒 **Private Chat Vault**: A secondary PIN-protected gate with client-side WebCrypto PBKDF2 hashing, auto-lock on inactivity or tab switch, and isolated private conversations.
- 👥 **Contacts & Close Friends**: Send/accept contact requests via Communication ID, manage a private Close Friends ring without notifying recipients.
- 🛡️ **Block & Privacy Controls**: Mutual block enforcement, customizable last seen/online visibility, read receipts toggle, and safety abuse reporting.
- 📱 **Responsive PWA UX**: Tailored for mobile screens, tablets, and desktops with soft blue and muted lavender calm aesthetics.

---

## Quick Start

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and provide your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Note: MESSAGER includes an interactive sandbox / demo mode if live Supabase keys are omitted, allowing full offline testing of all features including account switching, private chat, and thoughts).*

### 3. Database Migration
Execute `supabase/migrations/20260904_init_schema.sql` in your Supabase SQL Editor.

### 4. Run Development Server
```bash
npm run dev
```

---

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Database & RLS](docs/DATABASE.md)
- [Security & Cryptography](docs/SECURITY.md)
- [Privacy Model](docs/PRIVACY.md)
- [Private Chat Vault](docs/PRIVATE_CHAT.md)
- [Thoughts Feature](docs/THOUGHTS.md)
- [Performance & Scaling](docs/SCALING.md)
