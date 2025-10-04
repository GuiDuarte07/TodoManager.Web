export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  userId: string
  email: string
  name: string
}

export interface User {
  userId: string
  email: string
  name: string
}
