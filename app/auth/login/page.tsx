"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material"
import { LoginRounded, TaskAltRounded } from "@mui/icons-material"
import { AuthService } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import type { LoginDto } from "@/types/auth"

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>()

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true)
    setError("")

    
    try {
      const response = await AuthService.login(data)
      setUser({
        userId: response.userId,
        email: response.email,
        name: response.name,
      })
      router.push("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              mb: 2,
            }}
          >
            <TaskAltRounded sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography variant="h4" component="h1" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
            Todo Manager
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Gerencie suas tarefas de forma profissional
          </Typography>
        </Box>

        <Card
          sx={{
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}>
              Entrar na sua conta
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Senha"
                type="password"
                margin="normal"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "Senha deve ter no mínimo 6 caracteres",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <LoginRounded />}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Não tem uma conta?{" "}
                  <Link
                    href="/auth/register"
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Cadastre-se
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
