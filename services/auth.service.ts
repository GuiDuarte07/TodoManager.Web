import { apiClient } from "@/lib/api-client";
import type { RegisterDto, LoginDto, AuthResponse } from "@/types/auth";

export class AuthService {
  static async register(data: RegisterDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/api/auth/register", data);
  }

  static async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      data
    );

    if (response.token) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.userId,
          email: response.email,
          name: response.name,
        })
      );
    }

    return response;
  }

  static logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  }

  static getUser() {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
