import { create } from "zustand"
import type { TodoItemDto, TodoItemStatus } from "@/types/todo"

interface TodoState {
  todos: TodoItemDto[]
  selectedTodo: TodoItemDto | null
  filterStatus: TodoItemStatus | "all"
  searchQuery: string
  currentPage: number
  totalPages: number
  totalCount: number
  isLoading: boolean

  setTodos: (todos: TodoItemDto[]) => void
  setSelectedTodo: (todo: TodoItemDto | null) => void
  setFilterStatus: (status: TodoItemStatus | "all") => void
  setSearchQuery: (query: string) => void
  setCurrentPage: (page: number) => void
  setPagination: (totalPages: number, totalCount: number) => void
  setIsLoading: (isLoading: boolean) => void
  addTodo: (todo: TodoItemDto) => void
  updateTodo: (todo: TodoItemDto) => void
  removeTodo: (id: number) => void
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  selectedTodo: null,
  filterStatus: "all",
  searchQuery: "",
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  isLoading: false,

  setTodos: (todos) => set({ todos }),
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPagination: (totalPages, totalCount) => set({ totalPages, totalCount }),
  setIsLoading: (isLoading) => set({ isLoading }),

  addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),

  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
    })),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
}))
