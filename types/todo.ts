export enum TodoItemStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
}

export interface CreateTodoItemDto {
  title: string
  description?: string
  dueDate?: string
}

export interface UpdateTodoItemDto {
  title: string
  description?: string
  dueDate?: string
  status: TodoItemStatus
}

export interface TodoItemDto {
  id: number
  title: string
  description: string
  status: TodoItemStatus
  dueDate?: string
  createdAt: string
  updatedAt: string
  userName: string
}

export interface PagedListDto<T> {
  items: T[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
}
