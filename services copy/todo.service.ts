import { apiClient } from "@/lib/api-client";
import type {
  TodoItemDto,
  CreateTodoItemDto,
  UpdateTodoItemDto,
  PagedListDto,
} from "@/types/todo";

export class TodoService {
  static async getTodos(
    page = 1,
    pageSize = 10,
    status?: number
  ): Promise<PagedListDto<TodoItemDto>> {
    let endpoint = `/api/todo?page=${page}&pageSize=${pageSize}`;
    if (status !== undefined) {
      endpoint += `&status=${status}`;
    }
    return apiClient.get<PagedListDto<TodoItemDto>>(endpoint);
  }

  static async getTodoById(id: number): Promise<TodoItemDto> {
    return apiClient.get<TodoItemDto>(`/api/todo/${id}`);
  }

  static async createTodo(data: CreateTodoItemDto): Promise<TodoItemDto> {
    return apiClient.post<TodoItemDto>("/api/todo", data);
  }

  static async updateTodo(
    id: number,
    data: UpdateTodoItemDto
  ): Promise<TodoItemDto> {
    return apiClient.put<TodoItemDto>(`/api/todo/${id}`, data);
  }

  static async deleteTodo(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/todo/${id}`);
  }
}
