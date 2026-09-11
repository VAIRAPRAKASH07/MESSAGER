# Thoughts Feature Specification

## Overview
**Thoughts** are 24-hour ephemeral status updates where users can share quick reflections, media, photos, or text cards with custom color themes.

## Key Properties
- **24-Hour Lifetime**: Automatically expires 24 hours after creation (`expires_at = NOW() + INTERVAL '24 hours'`).
- **Audience Restrictions**:
  - `Everyone`: Visible to any connected user.
  - `Contacts`: Visible only to confirmed contacts in your address book.
  - `Close Friends`: Strictly restricted to users in your private Close Friends list.
  - `Nobody`: Private to creator.
- **Viewers Tracking**: The author can see who viewed their Thought (if allowed by viewer's privacy settings).
- **Interactive Fullscreen Viewer**: Segmented progress bars, tap-to-advance, tap-to-pause, and inline reply directly into a direct chat.
