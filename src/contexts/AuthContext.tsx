import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Profile, UserSettings } from '../types';
import { 
  supabase, 
  isLiveSupabaseConfigured, 
  mockAccountsDatabase, 
  createMockAccount, 
  generateServerCommunicationId,
  saveAccountsDatabaseToStorage,
  getPermanentIdForUser,
  savePermanentIdForUser,
  deleteAccountFromDatabase
} from '../lib/supabase';

export interface AccountSummary {
  id: string;
  email: string;
  name: string;
  commId: string;
  key?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
  settings: UserSettings | null;
  isLoading: boolean;
  isOnboarding: boolean;
  justGeneratedCommId: string | null;
  isRegisterOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  signInWithGoogle: (customEmail?: string, customName?: string) => Promise<void>;
  registerNewAccount: (displayName: string, customEmail?: string) => Promise<void>;
  deleteAccount: (userId?: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchAccount: (accountKeyOrId: string) => Promise<void>;
  redirectToRegister: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  completeOnboarding: () => void;
  activeAccountKey: string;
  allAccounts: AccountSummary[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PRESET_ACCOUNT_A = {
  id: 'user-google-account-a',
  email: 'user.a@google.example.com',
  name: 'Vaira Prakash',
  commId: '58392147',
};

const PRESET_ACCOUNT_B = {
  id: 'user-google-account-b',
  email: 'user.b@google.example.com',
  name: 'Elena Rostova',
  commId: '74120583',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [justGeneratedCommId, setJustGeneratedCommId] = useState<string | null>(null);
  const [activeAccountKey, setActiveAccountKey] = useState<string>('account_a');

  // Helper to get summaries of all existing accounts
  const getAllAccounts = (): AccountSummary[] => {
    return Object.values(mockAccountsDatabase).map((acc) => ({
      id: acc.authUserId,
      email: acc.email,
      name: acc.profile.display_name,
      commId: acc.profile.communication_id,
      key: acc.authUserId === PRESET_ACCOUNT_A.id ? 'account_a' : (acc.authUserId === PRESET_ACCOUNT_B.id ? 'account_b' : undefined),
      isActive: acc.authUserId === user?.id,
    }));
  };

  const [allAccounts, setAllAccounts] = useState<AccountSummary[]>([]);

  const refreshAccountsList = () => {
    setAllAccounts(getAllAccounts());
  };

  // Load active session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      if (isLiveSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email });
          // Fetch profile
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (prof) {
            setProfile(prof);
          }
          const { data: sett } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          if (sett) setSettings(sett);
        }
      } else {
        // Local Sandbox Session Check
        const savedSession = sessionStorage.getItem('messager_active_session');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            loadMockUser(parsed.id, parsed.email, parsed.name, parsed.commId);
          } catch {
            sessionStorage.removeItem('messager_active_session');
          }
        }
      }
      setIsLoading(false);
      refreshAccountsList();
    };

    initAuth();
  }, []);

  const loadMockUser = (userId: string, email: string, name: string, commId?: string, isNew = false) => {
    // Check if user has an existing permanent ID that must never change
    const permanentId = getPermanentIdForUser(userId) || getPermanentIdForUser(email) || commId || generateServerCommunicationId();

    if (!mockAccountsDatabase[userId]) {
      mockAccountsDatabase[userId] = createMockAccount(userId, email, name, permanentId);
    } else if (mockAccountsDatabase[userId].profile.communication_id !== permanentId) {
      mockAccountsDatabase[userId].profile.communication_id = permanentId;
    }

    // Save permanent ID index
    savePermanentIdForUser(userId, permanentId);
    savePermanentIdForUser(email, permanentId);
    saveAccountsDatabaseToStorage(mockAccountsDatabase);

    const acc = mockAccountsDatabase[userId];
    setUser({ id: acc.authUserId, email: acc.email });
    setProfile(acc.profile);
    setSettings(acc.settings);

    if (acc.authUserId === PRESET_ACCOUNT_A.id) {
      setActiveAccountKey('account_a');
    } else if (acc.authUserId === PRESET_ACCOUNT_B.id) {
      setActiveAccountKey('account_b');
    } else {
      setActiveAccountKey(acc.authUserId);
    }

    sessionStorage.setItem('messager_active_session', JSON.stringify({
      id: acc.authUserId,
      email: acc.email,
      name: acc.profile.display_name,
      commId: acc.profile.communication_id,
    }));

    refreshAccountsList();

    if (isNew) {
      setJustGeneratedCommId(acc.profile.communication_id);
      setIsOnboarding(true);
    }
  };

  const signInWithGoogle = async (customEmail?: string, customName?: string) => {
    setIsLoading(true);
    try {
      if (isLiveSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      } else {
        // Simulate Google OAuth flow
        await new Promise((r) => setTimeout(r, 400));
        const email = customEmail || PRESET_ACCOUNT_A.email;
        const name = customName || PRESET_ACCOUNT_A.name;
        
        let userId = PRESET_ACCOUNT_A.id;
        if (customEmail) {
          // Check if an existing account with this email exists to preserve permanent identity
          const existingAcc = Object.values(mockAccountsDatabase).find((a) => a.email.toLowerCase() === customEmail.toLowerCase());
          userId = existingAcc ? existingAcc.authUserId : `user-${Math.random().toString(36).slice(2, 9)}`;
        }

        const isNew = !mockAccountsDatabase[userId];
        loadMockUser(userId, email, name, undefined, isNew);
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
      alert('Google Sign-In simulation encountered an issue. Check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const registerNewAccount = async (displayName: string, customEmail?: string) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const safeName = displayName.trim() || 'New User';
      const email = customEmail?.trim() || `${safeName.toLowerCase().replace(/\s+/g, '.')}.${Math.floor(1000 + Math.random() * 9000)}@messager.network`;
      const userId = `user-${Math.random().toString(36).slice(2, 9)}`;
      const commId = generateServerCommunicationId();

      loadMockUser(userId, email, safeName, commId, true);
      setIsRegisterOpen(false);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccount = async (accountKeyOrId: string) => {
    setIsLoading(true);
    // 1. Wipe current in-memory view
    setProfile(null);
    setSettings(null);
    setUser(null);
    sessionStorage.removeItem('messager_active_session');
    sessionStorage.removeItem('messager_private_unlocked');

    await new Promise((r) => setTimeout(r, 300));

    // 2. Resolve account
    if (accountKeyOrId === 'account_a') {
      setActiveAccountKey('account_a');
      const target = PRESET_ACCOUNT_A;
      const isNew = !mockAccountsDatabase[target.id];
      loadMockUser(target.id, target.email, target.name, target.commId, isNew);
    } else if (accountKeyOrId === 'account_b') {
      setActiveAccountKey('account_b');
      const target = PRESET_ACCOUNT_B;
      const isNew = !mockAccountsDatabase[target.id];
      loadMockUser(target.id, target.email, target.name, target.commId, isNew);
    } else if (mockAccountsDatabase[accountKeyOrId]) {
      const acc = mockAccountsDatabase[accountKeyOrId];
      setActiveAccountKey(accountKeyOrId);
      loadMockUser(acc.authUserId, acc.email, acc.profile.display_name, acc.profile.communication_id, false);
    }
    setIsLoading(false);
  };

  const redirectToRegister = async () => {
    // Close current session and open registration page
    setIsLoading(true);
    setUser(null);
    setProfile(null);
    setSettings(null);
    setIsOnboarding(false);
    setJustGeneratedCommId(null);
    sessionStorage.removeItem('messager_active_session');
    sessionStorage.removeItem('messager_private_unlocked');
    setIsRegisterOpen(true);
    setIsLoading(false);
  };

  const deleteAccount = async (userIdToDelete?: string) => {
    const targetId = userIdToDelete || user?.id;
    if (!targetId) return;

    setIsLoading(true);
    try {
      if (isLiveSupabaseConfigured && supabase) {
        await supabase.from('profiles').delete().eq('id', targetId);
        await supabase.auth.signOut();
      } else {
        deleteAccountFromDatabase(targetId);
      }

      // Reset state and session
      setUser(null);
      setProfile(null);
      setSettings(null);
      setIsOnboarding(false);
      setJustGeneratedCommId(null);
      sessionStorage.removeItem('messager_active_session');
      sessionStorage.removeItem('messager_private_unlocked');
      refreshAccountsList();
    } catch (err) {
      console.error('Delete account failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isLiveSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      // Strict state clearance across the entire app
      setUser(null);
      setProfile(null);
      setSettings(null);
      setIsOnboarding(false);
      setJustGeneratedCommId(null);
      sessionStorage.removeItem('messager_active_session');
      sessionStorage.removeItem('messager_private_unlocked');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile || !user) return;
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);

    if (isLiveSupabaseConfigured && supabase) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    } else if (mockAccountsDatabase[user.id]) {
      mockAccountsDatabase[user.id].profile = updated;
      saveAccountsDatabaseToStorage(mockAccountsDatabase);
    }
    refreshAccountsList();
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings || !user) return;
    const updated = { ...settings, ...updates, updated_at: new Date().toISOString() };
    setSettings(updated);

    if (isLiveSupabaseConfigured && supabase) {
      await supabase.from('user_settings').update(updates).eq('user_id', user.id);
    } else if (mockAccountsDatabase[user.id]) {
      mockAccountsDatabase[user.id].settings = updated;
      saveAccountsDatabaseToStorage(mockAccountsDatabase);
    }
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    setJustGeneratedCommId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        settings,
        isLoading,
        isOnboarding,
        justGeneratedCommId,
        isRegisterOpen,
        openRegisterModal: () => setIsRegisterOpen(true),
        closeRegisterModal: () => setIsRegisterOpen(false),
        signInWithGoogle,
        registerNewAccount,
        deleteAccount,
        signOut,
        switchAccount,
        redirectToRegister,
        updateProfile,
        updateSettings,
        completeOnboarding,
        activeAccountKey,
        allAccounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
