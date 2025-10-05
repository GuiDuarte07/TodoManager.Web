import { apiClient } from "@/lib/api-client";
import type { RegisterDto, LoginDto, AuthResponse } from "@/types/auth";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

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
      setCookie("authToken", response.token, {
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      setCookie(
        "user",
        JSON.stringify({
          userId: response.userId,
          email: response.email,
          name: response.name,
        }),
        {
          maxAge: 7 * 24 * 60 * 60,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        }
      );
    }

    return response;
  }

  static logout(): void {
    deleteCookie("authToken");
    deleteCookie("user");
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return (getCookie("authToken") as string | undefined) ?? null;
  }

  static getUser(): string | null {
    if (typeof window === "undefined") return null;
    return (getCookie("user") as string | undefined) ?? null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
