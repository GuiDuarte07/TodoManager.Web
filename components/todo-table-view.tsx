import { TodoItemDto } from "@/types/todo";
import { AddRounded } from "@mui/icons-material";
import { Box, Button, Pagination, Typography } from "@mui/material";
import { TodoCard } from "./todo-card";

interface TodoCardProps {
  todos: TodoItemDto[];
  loadTodos: () => void;
  setCreateModalOpen: (arg0: boolean) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (_: React.ChangeEvent<unknown>, page: number) => void;
}

export function TodoTableView({
  todos,
  currentPage,
  totalPages,
  handlePageChange,
  loadTodos,
  setCreateModalOpen,
}: TodoCardProps) {
  return todos.length === 0 ? (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        bgcolor: "white",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        Nenhuma tarefa encontrada
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Comece criando sua primeira tarefa
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddRounded />}
        onClick={() => setCreateModalOpen(true)}
        sx={{ textTransform: "none" }}
      >
        Criar Tarefa
      </Button>
    </Box>
  ) : (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onUpdate={loadTodos} />
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </>
  );
}
