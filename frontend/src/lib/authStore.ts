import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
    authUser: any;
    isSigningIn: boolean;
    isSigningUp: boolean;
    isCreatingFlow: boolean;
    isCreatingInterview: boolean;
    isUploadingTask: boolean;
    isAnalyzingVideo: boolean;
    isLoadingJobs: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    signOut: () => void;
}


export const authStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Classic
            authUser: null,
            isSigningIn: false,
            isSigningUp: false,
            isCheckingAuth: true,
            // Pre-interview
            isCreatingFlow: false,
            isCreatingInterview: false,
            // Post-interview
            isUploadingTask: false,
            isAnalyzingVideo: false,
            // Jobs
            isLoadingJobs: false,

            checkAuth: async () => {
                try {
                    set({ isCheckingAuth: true });
                    const currentUser = get().authUser;
                    
                    if (currentUser) {
                        // User exists in store, keep them authenticated
                        set({ isCheckingAuth: false });
                        return;
                    }
                    
                    // If no user in store, they're not authenticated
                    set({ authUser: null, isCheckingAuth: false });
                } catch (err) {
                    console.error('Auth check failed:', err);
                    set({ authUser: null, isCheckingAuth: false });
                }
            },

            signOut: () => {
                set({ authUser: null });
                localStorage.removeItem('auth-storage');
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ authUser: state.authUser })
        }
    )
)