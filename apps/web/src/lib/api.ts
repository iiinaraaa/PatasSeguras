const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro desconhecido" }));
    const message =
      typeof error.message === "string"
        ? error.message
        : typeof error.message?.message === "string"
          ? error.message.message
          : "Erro desconhecido";
    throw new Error(message);
  }

  return res.json();
}
