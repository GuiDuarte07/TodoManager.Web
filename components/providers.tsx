"use client"

import type React from "react"

import { useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { useAuthStore } from "@/store/auth.store"

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#8b5cf6",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  shape: {
    borderRadius: 8,
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
