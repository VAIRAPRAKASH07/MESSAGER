# Performance & Scalability Architecture

## Performance Optimizations
1. **Cursor-Based Pagination**: Messages are loaded in batches of 30-50 using `created_at` cursors instead of unbounded full table queries.
2. **Indexed Database Lookups**: Indices on `communication_id`, `(conversation_id, created_at DESC)`, `(user_id, expires_at DESC)`, and composite foreign keys.
3. **Optimized Realtime Multiplexing**: A single unified Supabase channel per active conversation avoids WebSocket socket thrashing and client connection overhead.
4. **Lightweight Assets & Code Splitting**: Lucide icon tree-shaking, lazy-loaded modals, and WebP media compression.
5. **Debounced Search**: Search by Communication ID is debounced (350ms) to reduce unnecessary RPC / REST queries.
