import { TodoItemDto } from "@/types/todo";
import { AddRounded, ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TodoCard } from "./todo-card";

interface TodoCalendarViewProps {
  todos: TodoItemDto[];
  loadTodos: () => void;
  setCreateModalOpen: (arg0: boolean) => void;
  setPrefilledDate?: (date: string) => void;
}

export function TodoCalendarView({
  todos,
  loadTodos,
  setCreateModalOpen,
  setPrefilledDate,
}: TodoCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const hasTodosOnDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return todos.some((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate).toISOString().split("T")[0];
      return todoDate === dateStr;
    });
  };

  const getTodosForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate).toISOString().split("T")[0];
      return todoDate === dateStr;
    });
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    setDialogOpen(true);
  };

  const handleCreateForDate = () => {
    if (selectedDate && setPrefilledDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setPrefilledDate(dateStr);
    }
    setDialogOpen(false);
    setCreateModalOpen(true);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <Box
          key={`empty-${i}`}
          sx={{
            aspectRatio: "1",
            p: 1,
          }}
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const hasTodos = hasTodosOnDate(day);
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <Paper
          key={day}
          onClick={() => handleDayClick(day)}
          sx={{
            aspectRatio: "1",
            minWidth: 0,
            minHeight: 0,
            p: { xs: 0.5, sm: 1 },
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            bgcolor: hasTodos ? "primary.50" : "white",
            border: "1px solid",
            borderColor: isToday ? "primary.main" : "grey.200",
            borderWidth: isToday ? 2 : 1,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: hasTodos ? "primary.100" : "grey.50",
              transform: "scale(1.05)",
              boxShadow: 2,
            },
          }}
        >
          <Typography
            variant="body2"
            fontWeight={isToday ? "bold" : "normal"}
            color={isToday ? "primary.main" : "text.primary"}
          >
            {day}
          </Typography>
          {hasTodos && (
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "primary.main",
                mt: 0.5,
              }}
            />
          )}
        </Paper>
      );
    }

    return days;
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const selectedDateTodos = selectedDate ? getTodosForDate(selectedDate) : [];

  return (
    <>
      <Box sx={{ bgcolor: "white", borderRadius: 2, p: 3 }}>
        {/* Cabeçalho do calendário */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <IconButton onClick={previousMonth}>
            <ChevronLeftRounded />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <IconButton onClick={nextMonth}>
            <ChevronRightRounded />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            mb: 1,
          }}
        >
          {dayNames.map((day) => (
            <Box key={day} sx={{ textAlign: "center", py: 1 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary">
                {day}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
          }}
        >
          {renderCalendarDays()}
        </Box>


        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "primary.main",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Com tarefas
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: "50%",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Hoje
            </Typography>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              Tarefas de{" "}
              {selectedDate?.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddRounded />}
              onClick={handleCreateForDate}
              sx={{ textTransform: "none" }}
            >
              Nova Tarefa
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDateTodos.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Nenhuma tarefa para este dia
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              {selectedDateTodos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} onUpdate={loadTodos} />
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}