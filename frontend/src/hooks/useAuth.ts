/**
 * useAuth — stub kept for compatibility.
 * No Supabase. All auth removed.
 * @deprecated Use local store directly.
 */
export function useAuth() {
  return {
    user: null,
    session: null,
    loading: false,
    signIn: async () => ({ error: null }),
    signOut: async () => {},
    signUp: async () => ({ error: null }),
  };
}
