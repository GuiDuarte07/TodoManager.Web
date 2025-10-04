"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  MoreVertRounded,
  EditRounded,
  DeleteRounded,
  CalendarTodayRounded,
  CheckCircleRounded,
  RadioButtonUncheckedRounded,
  AccessTimeRounded,
} from "@mui/icons-material";
import { TodoService } from "@/services/todo.service";
import { useTodoStore } from "@/store/todo.store";
import { TodoItemStatus, type TodoItemDto } from "@/types/todo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TodoCardProps {
  todo: TodoItemDto;
  onUpdate: () => void;
}

export function TodoCard({ todo, onUpdate }: TodoCardProps) {
  const { setSelectedTodo, removeTodo, updateTodo } = useTodoStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [anchorElStatus, setAnchorElStatus] = useState<null | HTMLElement>(
    null
  );

  const statusOptions = Object.values(TodoItemStatus).filter(
    (value) => typeof value === "number"
  ) as TodoItemStatus[];

  const handleStatuMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleStatuMenuClose = () => {
    setAnchorElStatus(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setSelectedTodo(todo);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await TodoService.deleteTodo(todo.id);
      removeTodo(todo.id);
      setDeleteDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: TodoItemStatus) => {
    setIsDeleting(true);

    const updatedTodo = {
      ...todo,
      status: newStatus,
    };

    try {
      await TodoService.updateTodo(todo.id, updatedTodo);
      updateTodo(updatedTodo);
      handleStatuMenuClose();
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar status", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusConfig = (status: TodoItemStatus) => {
    switch (status) {
      case TodoItemStatus.Pending:
        return {
          label: "Pendente",
          color: "default" as const,
          icon: <RadioButtonUncheckedRounded fontSize="small" />,
        };
      case TodoItemStatus.InProgress:
        return {
          label: "Em Progresso",
          color: "primary" as const,
          icon: <AccessTimeRounded fontSize="small" />,
        };
      case TodoItemStatus.Completed:
        return {
          label: "Concluída",
          color: "success" as const,
          icon: <CheckCircleRounded fontSize="small" />,
        };
    }
  };

  const statusConfig = getStatusConfig(todo.status);

  return (
    <>
      <Card
        sx={{
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: 3,
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                {todo.title}
              </Typography>
              {todo.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {todo.description}
                </Typography>
              )}
            </Box>

            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertRounded />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              disabled={isUpdating}
              onClick={handleStatuMenuOpen}
              sx={{ cursor: "pointer" }}
            />

            <Menu
              open={Boolean(anchorElStatus)}
              anchorEl={anchorElStatus}
              onClose={handleStatuMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {statusOptions
                .filter((status) => status !== todo.status)
                .map((status) => {
                  const config = getStatusConfig(status);
                  return (
                    <MenuItem
                      key={status}
                      onClick={() => handleStatusChange(status)}
                    >
                      <Chip
                        icon={config.icon}
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{ cursor: "pointer" }}
                      />
                    </MenuItem>
                  );
                })}
            </Menu>

            {todo.dueDate && (
              <Chip
                icon={<CalendarTodayRounded fontSize="small" />}
                label={format(new Date(todo.dueDate), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
                size="small"
                variant="outlined"
                color={(() => {
                  const dueDate = new Date(todo.dueDate);
                  const today = new Date();

                  const normalize = (d: Date) =>
                    new Date(d.getFullYear(), d.getMonth(), d.getDate());
                  const nDue = normalize(dueDate);
                  const nToday = normalize(today);

                  if (nDue < nToday) return "error";
                  if (nDue.getTime() === nToday.getTime()) return "warning";
                  return "success";
                })()}
              />
            )}

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: "auto" }}
            >
              Atualizado em{" "}
              {format(new Date(todo.updatedAt), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditRounded sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <DeleteRounded sx={{ mr: 1 }} fontSize="small" />
          Excluir
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Excluir tarefa</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a tarefa "{todo.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
