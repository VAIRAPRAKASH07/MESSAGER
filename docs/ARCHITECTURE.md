# System Architecture

## Core Concept & High-Level Architecture

**MESSAGER** is a real-time, privacy-first messaging platform where personal communication identities are decoupled from phone numbers and emails.

Identity is anchored around an **8-Digit Communication ID** generated exclusively on the server after Google OAuth authentication.

```
+----------------------------------------------------------------------+
|                           CLIENT TIER                                |
|  - React 18 / TypeScript / Vite / Tailwind CSS / Lucide Icons        |
|  - WebCrypto PBKDF2 Vault Layer / Inactivity Auto-Lock Manager       |
|  - Realtime WebSocket Channels / Optimistic UI / PWA Shell           |
+-----------------------------------+----------------------------------+
                                    |
                    HTTPS REST / WSS Realtime
                                    |
+-----------------------------------v----------------------------------+
|                          SUPABASE / POSTGRES                         |
|  - Supabase Auth (Google OAuth 2.0 Identity Verification)            |
|  - PostgreSQL with Row Level Security (RLS) on all 13 Tables         |
|  - PL/pgSQL CSPRNG Unpredictable 8-Digit ID Generation Engine        |
|  - Realtime Replication for messages, reactions, typing & presence   |
|  - Ephemeral 24h Status Garbage Filtering via Server-Side Timestamps |
+----------------------------------------------------------------------+
```

## Authentication & Multi-Account Isolation Flow

1. **Visitor on Landing Page**:
   - Sees clear privacy value proposition: *"Connect without sharing your number."*
   - Explicitly marked fictional example: `Example: 12345678`.
   - No permanent ID exists or is reserved prior to Google sign-in.
2. **Google OAuth**:
   - Authenticates via Supabase OAuth endpoint.
   - Triggers `on_auth_user_created` in PostgreSQL.
   - Profile created with a server-generated 8-digit Communication ID.
3. **Onboarding Experience**:
   - First-time user receives the celebratory reveal: *"Your Communication ID is ready: `58392147`"*.
   - Options to Copy, Share, or Continue to the app.
4. **Account Switching**:
   - Clicking "Log out" triggers `supabase.auth.signOut()`, purges local memory stores, crypto keys, and subscriptions, then resets router to the landing page.
   - Logging in with Google Account B loads Account B's profile and Communication ID (`74120583`) with zero state leakage.
