import { createClient } from '@supabase/supabase-js';
import type { Profile, Conversation, Message, Thought, Contact, ContactRequest, BlockedUser, PrivateChatVault, UserSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') && 
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

// Real Supabase Client (if environment variables configured)
export const supabase = isLiveSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// IN-MEMORY / LOCAL SANDBOX STORE (Zero-Leakage Account Isolation Engine)
// ==============================================================================

export interface MockAccount {
  authUserId: string;
  email: string;
  profile: Profile;
  settings: UserSettings;
  vault?: PrivateChatVault;
  contacts: Contact[];
  contactRequests: ContactRequest[];
  closeFriends: string[]; // array of userIds
  blockedUsers: BlockedUser[];
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  thoughts: Thought[];
}

// Initial Mock Personas for Interactive Rich Experience
const MOCK_PERSONA_ALEX: Profile = {
  id: 'persona-alex-uuid',
  display_name: 'Alex Rivera',
  bio: 'Privacy advocate & designer. Message me with my ID!',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  communication_id: '48291045',
  is_online: true,
  last_seen_at: new Date().toISOString(),
  created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_PERSONA_JORDAN: Profile = {
  id: 'persona-jordan-uuid',
  display_name: 'Jordan Vance',
  bio: 'Building decentralized tech. Always open for ideas.',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  communication_id: '91823746',
  is_online: false,
  last_seen_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_PERSONA_SAM: Profile = {
  id: 'persona-sam-uuid',
  display_name: 'Dr. Sam Morgan',
  bio: 'Security researcher. Verify IDs before sharing.',
  avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  communication_id: '62740918',
  is_online: true,
  last_seen_at: new Date().toISOString(),
  created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  updated_at: new Date().toISOString(),
};

export const PUBLIC_DISCOVERABLE_PERSONAS: Profile[] = [
  MOCK_PERSONA_ALEX,
  MOCK_PERSONA_JORDAN,
  MOCK_PERSONA_SAM
];

/**
 * Generate an 8-digit CSPRNG Communication ID (Simulating PostgreSQL PL/pgSQL Function)
 */
export function generateServerCommunicationId(): string {
  const min = 10000000;
  const max = 99999999;
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  const randNum = min + (arr[0] % (max - min + 1));
  return randNum.toString();
}

/**
 * Seed initial data for a newly created mock account
 */
export function createMockAccount(authUserId: string, email: string, name: string, commId?: string): MockAccount {
  const communicationId = commId || generateServerCommunicationId();
  
  const profile: Profile = {
    id: authUserId,
    display_name: name,
    bio: 'Using MESSAGER for private communication.',
    communication_id: communicationId,
    is_online: true,
    last_seen_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const settings: UserSettings = {
    user_id: authUserId,
    privacy_messaging: 'everyone',
    privacy_thoughts: 'contacts',
    privacy_profile_photo: 'everyone',
    privacy_online: 'contacts',
    privacy_last_seen: 'contacts',
    read_receipts_enabled: true,
    notification_preview: true,
    sound_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Pre-populate realistic initial contacts & conversation
  const initialContacts: Contact[] = [
    {
      id: `contact-alex-${authUserId}`,
      user_id: authUserId,
      contact_user_id: MOCK_PERSONA_ALEX.id,
      contact_profile: MOCK_PERSONA_ALEX,
      is_close_friend: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: `contact-jordan-${authUserId}`,
      user_id: authUserId,
      contact_user_id: MOCK_PERSONA_JORDAN.id,
      contact_profile: MOCK_PERSONA_JORDAN,
      is_close_friend: false,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];

  const convAlexId = `conv-alex-${authUserId}`;
  const convJordanId = `conv-jordan-${authUserId}`;

  const initialConversations: Conversation[] = [
    {
      id: convAlexId,
      type: 'direct',
      is_private_vault: false,
      other_member: MOCK_PERSONA_ALEX,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      unread_count: 1,
      is_pinned: true,
    },
    {
      id: convJordanId,
      type: 'direct',
      is_private_vault: false,
      other_member: MOCK_PERSONA_JORDAN,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      unread_count: 0,
      is_pinned: false,
    }
  ];

  const initialMessages: Record<string, Message[]> = {
    [convAlexId]: [
      {
        id: `msg-1-${authUserId}`,
        conversation_id: convAlexId,
        sender_id: MOCK_PERSONA_ALEX.id,
        sender_profile: MOCK_PERSONA_ALEX,
        content: `Hey! Welcome to MESSAGER. Your Communication ID is ${communicationId}. No one can see your phone number or email!`,
        message_type: 'text',
        is_edited: false,
        is_deleted: false,
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        reactions: [{ id: 'r1', message_id: `msg-1-${authUserId}`, user_id: authUserId, emoji: '🔒', created_at: new Date().toISOString() }]
      },
      {
        id: `msg-2-${authUserId}`,
        conversation_id: convAlexId,
        sender_id: MOCK_PERSONA_ALEX.id,
        sender_profile: MOCK_PERSONA_ALEX,
        content: `Try posting a Thought or setting up your Private Chat PIN vault in the sidebar. Let me know if you have any questions!`,
        message_type: 'text',
        is_edited: false,
        is_deleted: false,
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      }
    ],
    [convJordanId]: [
      {
        id: `msg-j1-${authUserId}`,
        conversation_id: convJordanId,
        sender_id: MOCK_PERSONA_JORDAN.id,
        sender_profile: MOCK_PERSONA_JORDAN,
        content: `Great connecting with you via Communication ID. The privacy model here is top notch.`,
        message_type: 'text',
        is_edited: false,
        is_deleted: false,
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      }
    ]
  };

  const initialThoughts: Thought[] = [
    {
      id: `thought-alex-1`,
      user_id: MOCK_PERSONA_ALEX.id,
      user_profile: MOCK_PERSONA_ALEX,
      content: 'Exploring minimalist privacy architecture today 🌿 Design should protect identity by default.',
      media_type: 'text',
      background_style: {
        theme: 'ocean',
        gradient: 'from-blue-600 to-indigo-800',
        font: 'sans'
      },
      audience: 'contacts',
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      views_count: 4,
      has_viewed: false,
    },
    {
      id: `thought-sam-1`,
      user_id: MOCK_PERSONA_SAM.id,
      user_profile: MOCK_PERSONA_SAM,
      content: 'Never share personal phone numbers on public forums. 8-digit IDs are the future 🔐',
      media_type: 'text',
      background_style: {
        theme: 'lavender',
        gradient: 'from-purple-600 to-indigo-700',
        font: 'sans'
      },
      audience: 'close_friends',
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      views_count: 2,
      has_viewed: false,
    }
  ];

  return {
    authUserId,
    email,
    profile,
    settings,
    contacts: initialContacts,
    contactRequests: [],
    closeFriends: [MOCK_PERSONA_ALEX.id],
    blockedUsers: [],
    conversations: initialConversations,
    messages: initialMessages,
    thoughts: initialThoughts,
  };
}

// Global in-memory accounts cache for sandbox mode with permanent localStorage persistence
const ACCOUNTS_STORAGE_KEY = 'messager_mock_accounts_database_v2';
const PERMANENT_ID_MAP_KEY = 'messager_permanent_comm_ids_v2';

export function loadAccountsDatabaseFromStorage(): Record<string, MockAccount> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load accounts from storage:', err);
  }

  // Initialize with Default Preset Accounts
  const initial: Record<string, MockAccount> = {};
  const accA = createMockAccount('user-google-account-a', 'user.a@google.example.com', 'Vaira Prakash', '58392147');
  const accB = createMockAccount('user-google-account-b', 'user.b@google.example.com', 'Elena Rostova', '74120583');
  initial[accA.authUserId] = accA;
  initial[accB.authUserId] = accB;
  saveAccountsDatabaseToStorage(initial);
  return initial;
}

export function saveAccountsDatabaseToStorage(db: Record<string, MockAccount>): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save accounts to storage:', err);
  }
}

export function getPermanentIdForUser(userIdOrEmail: string): string | null {
  try {
    const raw = localStorage.getItem(PERMANENT_ID_MAP_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      return map[userIdOrEmail] || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export function savePermanentIdForUser(userIdOrEmail: string, commId: string): void {
  try {
    const raw = localStorage.getItem(PERMANENT_ID_MAP_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[userIdOrEmail] = commId;
    localStorage.setItem(PERMANENT_ID_MAP_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function deleteAccountFromDatabase(userId: string): void {
  if (mockAccountsDatabase[userId]) {
    delete mockAccountsDatabase[userId];
    saveAccountsDatabaseToStorage(mockAccountsDatabase);
  }
  // Also clean up any active session for this user
  try {
    const active = sessionStorage.getItem('messager_active_session');
    if (active) {
      const parsed = JSON.parse(active);
      if (parsed.id === userId) {
        sessionStorage.removeItem('messager_active_session');
        sessionStorage.removeItem('messager_private_unlocked');
      }
    }
  } catch {
    // ignore
  }
}

export const mockAccountsDatabase: Record<string, MockAccount> = loadAccountsDatabaseFromStorage();

