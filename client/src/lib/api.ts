import type { Session } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { AppUser } from "@/types/auth";

type RequestOptions = {
  body?: unknown;
  headers?: HeadersInit;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  session?: Session | null;
};

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.session?.access_token) {
    headers.set("Authorization", `Bearer ${options.session.access_token}`);
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload?.message === "string" ? payload.message : "Request failed.";
    throw new Error(message);
  }

  return payload as T;
}

export const api = {
  forgotPassword(email: string) {
    return request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
  },
  syncUser(session: Session) {
    return request<{ data: AppUser }>("/auth/sync-user", {
      method: "POST",
      session,
      body: {},
    });
  },
  me(session: Session) {
    return request<{ data: AppUser }>("/auth/me", {
      session,
    });
  },
};
