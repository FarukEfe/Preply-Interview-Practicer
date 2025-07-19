import { create } from 'zustand';
import { backend } from './axios.ts';

export interface AuthState {
    authUser: any;
    isSigningIn: boolean;
    isSigningUp: boolean;
    isCreatingFlow: boolean;
    isCreatingInterview: boolean;
    isUploadingTask: boolean;
    isAnalyzingVideo: boolean;
    isLoadingJobs: boolean;
}


export const authStore = create<AuthState>((set) => ({
    // Classic
    authUser: null,
    isSigningIn: false,
    isSigningUp: false,
    // Pre-interview
    isCreatingFlow: false,
    isCreatingInterview: false,
    // Post-interview
    isUploadingTask: false,
    isAnalyzingVideo: false,
    // Jobs
    isLoadingJobs: false,

    // isCheckingAuth: true,
    // checkAuth: async () => {
    //     try {

    //     } catch (err) {

    //     }
    // }
}))