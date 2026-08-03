import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Nome muito curto').max(120).optional(),
  photoUrl: z.string().url('URL de foto inválida').optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
