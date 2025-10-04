"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { CircularProgress, Box } from "@mui/material"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/home")
      } else {
        router.push("/auth/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  )
}
