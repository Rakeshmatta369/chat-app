import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import axios from 'axios'

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            // const res = await axios.get('http://localhost:5001/api/auth/check' , {withCredentials : true});
            
            // set({ authUser: res.data })
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null })

        } finally {
            set({ isCheckingAuth: false })
        }
    }
}))