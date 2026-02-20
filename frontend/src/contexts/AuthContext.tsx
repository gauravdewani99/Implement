import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi } from "@/api/endpoints/auth"
import { setAccessToken } from "@/api/client"
import type { UserResponse } from "@/api/types"

interface AuthContextType {
  user: UserResponse | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      setAccessToken(token)

      // Race the token-check against a 5-second timeout so users don't
      // stare at a blank screen if the backend is cold-starting.
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Token check timed out")), 5_000),
      )

      Promise.race([authApi.me(), timeout])
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("access_token")
          setAccessToken(null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { access_token } = await authApi.login(email, password)
    localStorage.setItem("access_token", access_token)
    setAccessToken(access_token)
    const me = await authApi.me()
    setUser(me)
  }

  const register = async (email: string, password: string, fullName?: string) => {
    const { access_token } = await authApi.register(email, password, fullName)
    localStorage.setItem("access_token", access_token)
    setAccessToken(access_token)
    const me = await authApi.me()
    setUser(me)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
