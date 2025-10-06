"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  InputAdornment,
} from "@mui/material"
import { AddRounded, TitleRounded, DescriptionRounded, CalendarTodayRounded } from "@mui/icons-material"
import { TodoService } from "@/services/todo.service"
import { useTodoStore } from "@/store/todo.store"
import type { CreateTodoItemDto } from "@/types/todo"
import { AxiosError } from "axios"

interface CreateTodoModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateTodoModal({ open, onClose, onSuccess }: CreateTodoModalProps) {
  const { addTodo } = useTodoStore()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTodoItemDto>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  })

  const handleClose = () => {
    reset()
    setError("")
    onClose()
  }

  const onSubmit = async (data: CreateTodoItemDto) => {
    setIsLoading(true)
    setError("")

    try {
      const payload = {
        ...data,
        dueDate: data.dueDate || undefined,
      }
      const newTodo = await TodoService.createTodo(payload)
      addTodo(newTodo)
      handleClose()
      onSuccess()
    } catch (err) {
      setError(err instanceof AxiosError ? err.response?.data.error  : "Erro ao criar tarefa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>Criar Nova Tarefa</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Título é obrigatório",
                maxLength: {
                  value: 100,
                  message: "Título deve ter no máximo 100 caracteres",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleRounded />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: {
                  value: 500,
                  message: "Descrição deve ter no máximo 500 caracteres",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                        <DescriptionRounded />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Data de Vencimento"
                  type="date"
                  fullWidth
                  disabled={isLoading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayRounded />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isLoading} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={<AddRounded />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isLoading ? "Criando..." : "Criar Tarefa"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
