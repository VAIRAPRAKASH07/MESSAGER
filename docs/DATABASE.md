# Database Architecture & RLS Documentation

## PostgreSQL Tables Schema

| Table Name | Primary Key | Key Relationships / Indices | Purpose |
|---|---|---|---|
| `profiles` | `id` (UUID) | `communication_id` (UNIQUE VARCHAR(10)) | Public persona (name, avatar, bio, ID) without emails |
| `communication_ids` | `id` (BIGSERIAL) | `code` UNIQUE, `user_id` UNIQUE | Permanent registry of allocated IDs |
| `contacts` | `id` (UUID) | `(user_id, contact_user_id)` UNIQUE | Connected address book |
| `contact_requests` | `id` (UUID) | `(sender_id, receiver_id)` UNIQUE | Friend/connection request handshake |
| `close_friends` | `id` (UUID) | `(user_id, friend_id)` UNIQUE | Private Close Friends ring for selective Thought sharing |
| `blocked_users` | `id` (UUID) | `(blocker_id, blocked_id)` UNIQUE | Mutual communication suppression |
| `conversations` | `id` (UUID) | `is_private_vault` (BOOLEAN) | Chat threads (standard & private vault) |
| `conversation_members` | `id` (UUID) | `(conversation_id, user_id)` UNIQUE | Membership & read markers |
| `messages` | `id` (UUID) | `(conversation_id, created_at DESC)` | Real-time messages, edits & deletions |
| `message_reactions` | `id` (UUID) | `(message_id, user_id, emoji)` UNIQUE | Emoji reactions |
| `message_reads` | `id` (UUID) | `(message_id, user_id)` UNIQUE | Read receipt verification |
| `thoughts` | `id` (UUID) | `(user_id, expires_at DESC)` | 24h ephemeral status updates |
| `thought_views` | `id` (UUID) | `(thought_id, viewer_id)` UNIQUE | Viewer tracking |
| `private_chat_vaults` | `user_id` (UUID) | `pin_hash`, `pin_salt`, `auto_lock_interval` | PIN protection metadata for Private Chat |
| `user_settings` | `user_id` (UUID) | `privacy_messaging`, `privacy_thoughts` | Granular privacy & notification controls |
| `reports` | `id` (UUID) | `reporter_id` | Moderation & safety abuse reporting |

## Row Level Security (RLS) Strategy

1. **Zero Email Disclosure**: Profiles only expose display name, avatar, bio, and Communication ID.
2. **Mutual Block Enforcement**: The function `is_blocked_bidirectional(user_a, user_b)` prevents messages, requests, and queries between blocked parties.
3. **Thought Audience Filtration**: Server-side RLS prevents non-close friends from accessing Close-Friends-only thoughts even via direct GraphQL/REST queries.
4. **Private Chat Vault Isolation**: Private vault records are isolated per-user; conversations marked with `is_private_vault` require active unlocked PIN session on client and membership validation in SQL.
