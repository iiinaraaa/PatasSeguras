const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

export interface Pet {
  id: string;
  name: string;
  species: "DOG" | "CAT" | "OTHER";
  breed?: string;
  sex: "MALE" | "FEMALE" | "UNKNOWN";
  city?: string;
  state?: string;
  isActive: boolean;
  createdAt: string;
}

async function authFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro desconhecido" }));
    const message = typeof error.message === "string" ? error.message : error.message?.message || "Erro desconhecido";
    throw new Error(message);
  }

  return res.json();
}

export function listPets(token: string): Promise<Pet[]> {
  return authFetch("/pets", token);
}

export function createPet(token: string, data: Record<string, unknown>): Promise<Pet> {
  return authFetch("/pets", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
