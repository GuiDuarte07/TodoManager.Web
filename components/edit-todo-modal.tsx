"use client"

import { useState, useEffect } from "react"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { SaveRounded, TitleRounded, DescriptionRounded, CalendarTodayRounded, FlagRounded } from "@mui/icons-material"
import { TodoService } from "@/services/todo.service"
import { useTodoStore } from "@/store/todo.store"
import { TodoItemStatus, type UpdateTodoItemDto } from "@/types/todo"
import { format } from "date-fns"
import { AxiosError } from "axios"

export function EditTodoModal({ onSuccess }: { onSuccess: () => void }) {
  const { selectedTodo, setSelectedTodo, updateTodo } = useTodoStore()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTodoItemDto>()

  useEffect(() => {
    if (selectedTodo) {
      reset({
        title: selectedTodo.title,
        description: selectedTodo.description,
        dueDate: selectedTodo.dueDate ? format(new Date(selectedTodo.dueDate), "yyyy-MM-dd") : "",
        status: selectedTodo.status,
      })
    }
  }, [selectedTodo, reset])

  const handleClose = () => {
    reset()
    setError("")
    setSelectedTodo(null)
  }

  const onSubmit = async (data: UpdateTodoItemDto) => {
    if (!selectedTodo) return

    setIsLoading(true)
    setError("")

    try {
      const payload = {
        ...data,
        dueDate: data.dueDate || undefined,
      }
      const updatedTodo = await TodoService.updateTodo(selectedTodo.id, payload)
      updateTodo(updatedTodo)
      handleClose()
      onSuccess()
    } catch (err) {
      setError(err instanceof AxiosError ? err.response?.data.error : "Erro ao atualizar tarefa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={!!selectedTodo} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>Editar Tarefa</DialogTitle>

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

            <Controller
              name="status"
              control={control}
              rules={{ required: "Status é obrigatório" }}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.status} disabled={isLoading}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    {...field}
                    label="Status"
                    startAdornment={
                      <InputAdornment position="start">
                        <FlagRounded />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value={TodoItemStatus.Pending}>Pendente</MenuItem>
                    <MenuItem value={TodoItemStatus.InProgress}>Em Progresso</MenuItem>
                    <MenuItem value={TodoItemStatus.Completed}>Concluída</MenuItem>
                  </Select>
                </FormControl>
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
            startIcon={<SaveRounded />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
