"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import {
  AddRounded,
  CalendarMonth,
  FilterListRounded,
  List,
  ViewKanban,
} from "@mui/icons-material";
import { TodoService } from "@/services/todo.service";
import { useTodoStore } from "@/store/todo.store";
import { useAuthStore } from "@/store/auth.store";
import { TodoItemStatus } from "@/types/todo";
import { AppHeader } from "@/components/app-header";
import { TodoCard } from "@/components/todo-card";
import { TodoFilters } from "@/components/todo-filters";
import { CreateTodoModal } from "@/components/create-todo-modal";
import { EditTodoModal } from "@/components/edit-todo-modal";
import { TodoTableView } from "@/components/todo-table-view";
import { TodoCalendarView } from "@/components/todo-calendar-view";
import { TodoKanbanView } from "@/components/todo-kanban-view";

export default function HomePage() {
  const { user } = useAuthStore();
  const {
    todos,
    filterStatus,
    currentPage,
    totalPages,
    isLoading,
    setTodos,
    setIsLoading,
    setPagination,
    setCurrentPage,
  } = useTodoStore();

  const [error, setError] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [visualization, setVisualization] = useState<
    "table" | "calendar" | "kanban"
  >("table");

  function changeVisualization(view: "table" | "calendar" | "kanban") {
    setVisualization(view);
  }

  const loadTodos = async () => {
    setIsLoading(true);
    setError("");

    try {
      const pageSize = visualization === 'table' ? 10 : 1000
      const statusFilter = filterStatus === "all" ? undefined : filterStatus;
      const response = await TodoService.getTodos(
        currentPage,
        pageSize,
        statusFilter
      );
      console.log(response.items);
      setTodos(response.items);
      setPagination(response.totalPages, response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tarefas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [currentPage, filterStatus]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const getStatusCount = (status: TodoItemStatus) => {
    return todos.filter((todo) => todo.status === status).length;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppHeader />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                Minhas Tarefas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bem-vindo de volta, {user?.name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListRounded />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ textTransform: "none" }}
              >
                Filtros
              </Button>
              <Button
                variant="contained"
                startIcon={<AddRounded />}
                onClick={() => setCreateModalOpen(true)}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Nova Tarefa
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <Chip
              label={`Pendentes: ${getStatusCount(TodoItemStatus.Pending)}`}
              color="default"
              variant="outlined"
            />
            <Chip
              label={`Em Progresso: ${getStatusCount(
                TodoItemStatus.InProgress
              )}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Concluídas: ${getStatusCount(TodoItemStatus.Completed)}`}
              color="success"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="small"
              disabled={visualization === 'table'}
              startIcon={<List />}
              onClick={() => changeVisualization("table")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Visualização em lista
            </Button>

            <Button
              variant="contained"
              size="small"
              disabled={visualization === 'calendar'}
              startIcon={<CalendarMonth />}
              onClick={() => changeVisualization("calendar")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Visualização em calendário
            </Button>

            <Button
              variant="contained"
              size="small"
              disabled={visualization === 'kanban'}
              startIcon={<ViewKanban />}
              onClick={() => changeVisualization("kanban")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Visualização em Kanban
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <TodoFilters />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : visualization === "table" ? (
          <TodoTableView
            todos={todos}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            loadTodos={loadTodos}
            setCreateModalOpen={(value: boolean) => setCreateModalOpen(value)}
          ></TodoTableView>
        ) : visualization === "calendar" ? (
          <TodoCalendarView
            todos={todos}
            loadTodos={loadTodos}
            setCreateModalOpen={(value: boolean) => setCreateModalOpen(value)}
          />
        ) : visualization === "kanban" ? (
          <TodoKanbanView todos={todos} loadTodos={loadTodos} />
        ) : (
          <></>
        )}
      </Container>

      <CreateTodoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadTodos}
      />

      <EditTodoModal onSuccess={loadTodos} />
    </Box>
  );
}
