"use client"

import type React from "react"

import { ToggleButtonGroup, ToggleButton, Paper } from "@mui/material"
import {
  RadioButtonUncheckedRounded,
  AccessTimeRounded,
  CheckCircleRounded,
  ViewListRounded,
} from "@mui/icons-material"
import { useTodoStore } from "@/store/todo.store"
import { TodoItemStatus } from "@/types/todo"

export function TodoFilters() {
  const { filterStatus, setFilterStatus } = useTodoStore()

  const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newFilter: TodoItemStatus | "all" | null) => {
    if (newFilter !== null) {
      setFilterStatus(newFilter)
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <ToggleButtonGroup
        value={filterStatus}
        exclusive
        onChange={handleFilterChange}
        aria-label="filtro de status"
        fullWidth
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          "& .MuiToggleButton-root": {
            flex: { xs: "1 1 45%", sm: "1 1 auto" },
            textTransform: "none",
          },
        }}
      >
        <ToggleButton value="all" aria-label="todas">
          <ViewListRounded sx={{ mr: 1 }} />
          Todas
        </ToggleButton>
        <ToggleButton value={TodoItemStatus.Pending} aria-label="pendentes">
          <RadioButtonUncheckedRounded sx={{ mr: 1 }} />
          Pendentes
        </ToggleButton>
        <ToggleButton value={TodoItemStatus.InProgress} aria-label="em progresso">
          <AccessTimeRounded sx={{ mr: 1 }} />
          Em Progresso
        </ToggleButton>
        <ToggleButton value={TodoItemStatus.Completed} aria-label="concluídas">
          <CheckCircleRounded sx={{ mr: 1 }} />
          Concluídas
        </ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  )
}
