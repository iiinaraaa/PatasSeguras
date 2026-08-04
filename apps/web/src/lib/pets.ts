const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

export interface Pet {
  id: string;
  name: string;
  species: "DOG" | "CAT" | "OTHER";
  breed?: string;
  sex: "MALE" | "FEMALE" | "UNKNOWN";
  photoUrl?: string | null;
  city?: string;
  state?: string;
  neighborhood?: string | null;
  number?: string | null;
  complement?: string | null;
  addressNotes?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface PetDetail extends Pet {
  qrCode: { id: string; slug: string } | null;
}

interface MedicalRecordSummary {
  id: string;
  type: "MEDICATION" | "DISEASE" | "ALLERGY" | "NOTE";
  title: string;
  details?: string | null;
}

export interface PublicPet {
  name: string;
  species: "DOG" | "CAT" | "OTHER";
  breed?: string | null;
  photoUrl?: string | null;
  city?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  contactEmail?: string | null;
  contactInstagram?: string | null;
  behaviorNotes?: string | null;
  medications: MedicalRecordSummary[];
  allergies: MedicalRecordSummary[];
  diseases: MedicalRecordSummary[];
  isLost: boolean;
  lostInfo: { lastSeenLocation?: string | null; notes?: string | null; lostAt: string } | null;
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

export function getPet(token: string, id: string): Promise<PetDetail> {
  return authFetch(`/pets/${id}`, token);
}

export function createPet(token: string, data: Record<string, unknown>): Promise<Pet> {
  return authFetch("/pets", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPublicPet(slug: string): Promise<PublicPet> {
  const res = await fetch(`${API_URL}/public/pets/${slug}`);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erro desconhecido" }));
    const message = typeof error.message === "string" ? error.message : error.message?.message || "Erro desconhecido";
    throw new Error(message);
  }

  return res.json();
}
