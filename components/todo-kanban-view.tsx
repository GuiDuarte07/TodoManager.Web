import { TodoItemDto, TodoItemStatus } from "@/types/todo";
import {
  AccessTimeRounded,
  CheckCircleRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TodoCard } from "./todo-card";
import { TodoService } from "@/services/todo.service";

interface TodoKanbanViewProps {
  todos: TodoItemDto[];
  loadTodos: () => void;
}

interface Column {
  id: TodoItemStatus;
  title: string;
  color: "default" | "primary" | "success";
  icon:  React.ReactElement<unknown>;
}

const columns: Column[] = [
  {
    id: TodoItemStatus.Pending,
    title: "Pendente",
    color: "default",
    icon: <RadioButtonUncheckedRounded fontSize="small" />,
  },
  {
    id: TodoItemStatus.InProgress,
    title: "Em Progresso",
    color: "primary",
    icon: <AccessTimeRounded fontSize="small" />,
  },
  {
    id: TodoItemStatus.Completed,
    title: "Concluída",
    color: "success",
    icon: <CheckCircleRounded fontSize="small" />,
  },
];

export function TodoKanbanView({ todos, loadTodos }: TodoKanbanViewProps) {
  const [expandedColumns, setExpandedColumns] = useState<{
    [key in TodoItemStatus]: boolean;
  }>({
    [TodoItemStatus.Pending]: true,
    [TodoItemStatus.InProgress]: true,
    [TodoItemStatus.Completed]: true,
  });

  const [draggedTodo, setDraggedTodo] = useState<TodoItemDto | null>(null);


  const getTasksByStatus = (status: TodoItemStatus): TodoItemDto[] => {
    return todos.filter((todo) => todo.status === status);
  };

  const toggleColumn = (status: TodoItemStatus) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };


  const handleDragStart = (todo: TodoItemDto) => {
    setDraggedTodo(todo);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus: TodoItemStatus) => {
    if (!draggedTodo || draggedTodo.status === newStatus) {
      setDraggedTodo(null);
      return;
    }

    try {

      await TodoService.updateTodo(draggedTodo.id, {
        status: newStatus,
        title: draggedTodo.title,
        description: draggedTodo.description,
        dueDate: draggedTodo.dueDate,
      });

      loadTodos();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setDraggedTodo(null);
    }
  };

  const gridColumns = columns
    .map((col) => (expandedColumns[col.id] ? "1fr" : "auto"))
    .join(" ");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
        alignItems: "start"
      }}
    >
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isExpanded = expandedColumns[column.id];

        return (
          <Paper
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              overflow: "hidden",
              transition: "all 0.3s",
              minHeight: isExpanded ? 400 : "auto",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "grey.200",
                bgcolor: "grey.50",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  icon={column.icon}
                  label={column.title}
                  color={column.color}
                  size="small"
                />
                <Chip
                  label={columnTasks.length}
                  size="small"
                  sx={{
                    bgcolor: "grey.200",
                    color: "text.primary",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              <IconButton
                size="small"
                onClick={() => toggleColumn(column.id)}
                sx={{
                  transition: "transform 0.3s",
                  transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
                }}
              >
                {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
              </IconButton>
            </Box>

            <Collapse in={isExpanded}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minHeight: 300,
                  maxHeight: 600,
                  overflowY: "auto",
                }}
              >
                {columnTasks.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 200,
                      border: "2px dashed",
                      borderColor: "grey.300",
                      borderRadius: 2,
                      bgcolor: "grey.50",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma tarefa
                    </Typography>
                  </Box>
                ) : (
                  columnTasks.map((todo) => (
                    <Box
                      key={todo.id}
                      draggable
                      onDragStart={() => handleDragStart(todo)}
                      sx={{
                        cursor: "grab",
                        "&:active": { cursor: "grabbing" },
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <TodoCard todo={todo} onUpdate={loadTodos} />
                    </Box>
                  ))
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
}