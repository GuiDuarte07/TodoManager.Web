import { create } from "zustand"
import { AuthService } from "@/services/auth.service"
import type { User } from "@/types/auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    AuthService.logout()
    set({ user: null, isAuthenticated: false })
  },

  initialize: () => {
    const user = AuthService.getUser()
    set({ user, isAuthenticated: !!user, isLoading: false })
  },
}))
