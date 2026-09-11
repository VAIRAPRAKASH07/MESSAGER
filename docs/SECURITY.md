# Security & Cryptographic Architecture

## 1. Authentication Security
- Authentication relies strictly on Google OAuth 2.0 through Supabase Auth.
- No main account passwords or credentials are stored or handled directly.
- Access tokens and refresh tokens are handled securely with zero exposure to untrusted scripts.

## 2. Server-Side Communication ID Generation
- Communication IDs are generated via CSPRNG `generate_unique_communication_id()`.
- Generation is strictly non-sequential and non-deterministic, preventing enumeration and scraping attacks.
- Assigned solely after database trigger execution following verified Google Auth.

## 3. Private Chat Password/PIN Security
- PINs are never sent in plaintext or stored in plaintext in PostgreSQL.
- The client derives a cryptographic hash using **PBKDF2 SHA-256** with 100,000 rounds and a unique per-user 16-byte salt via the native WebCrypto API.
- Rate limiting and lockout counters mitigate brute force PIN attempts.

## 4. OWASP Compliance & Defensive Controls
- **XSS Prevention**: React DOM auto-escaping + sanitized content rendering.
- **IDOR Protection**: PostgreSQL RLS policies validate `auth.uid()` on every table action.
- **SQL Injection Prevention**: Parameterized queries via Supabase JS client and prepared statements.
- **Safe Public Exposure**: The search endpoint returns only sanitized public fields (`display_name`, `avatar_url`, `communication_id`, `bio`).
