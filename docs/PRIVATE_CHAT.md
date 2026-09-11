# Private Chat Feature Specification

## Purpose & Architecture
**Private Chat** creates a protected vault area inside MESSAGER, guarding intimate or confidential conversations against shoulder surfing, device borrowing, or unauthorized physical device access.

```
Main App
  ├── Normal Chats (accessible immediately upon Google Auth)
  └── Private Chat Gate
        ├── Locked Screen ("Your private conversations are protected")
        ├── PIN/Password Entry (Client-side PBKDF2 WebCrypto verification)
        └── Unlocked Private Chat Area
              ├── Private 1-to-1 Conversations
              ├── Real-time messaging, attachments, reactions
              └── Auto-Lock Timer (Immediate, 1m, 5m, 15m)
```

## Security Clarification
*Private Chat provides an authenticated application gate and memory encryption context. It is an access barrier on authenticated devices. Database rows marked with `is_private_vault` are kept separate from normal conversation queries.*

## Auto-Lock Triggers
1. **Configurable Inactivity**: 1, 5, or 15 minutes of zero interaction.
2. **Tab Invisibility**: Switching browser tabs or minimizing the app can immediately lock the vault depending on user settings.
3. **Explicit Lock**: A single-tap "Lock Now" button in the header/sidebar.
4. **Account Sign Out**: Completely purges the memory key and resets vault status.
