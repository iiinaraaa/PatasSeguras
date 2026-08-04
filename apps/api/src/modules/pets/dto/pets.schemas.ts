import { z } from 'zod';

export const petSpeciesEnum = z.enum(['DOG', 'CAT', 'OTHER']);
export const petSexEnum = z.enum(['MALE', 'FEMALE', 'UNKNOWN']);
export const petSizeEnum = z.enum(['SMALL', 'MEDIUM', 'LARGE']);

export const createPetSchema = z.object({
  name: z.string().min(1, 'Nome do pet é obrigatório').max(80),
  species: petSpeciesEnum,
  breed: z.string().max(80).optional(),
  sex: petSexEnum,
  color: z.string().max(60).optional(),
  size: petSizeEnum.optional(),
  weightKg: z.number().positive().max(200).optional(),
  birthDate: z.coerce.date().optional(),
  isNeutered: z.boolean().optional().default(false),
  microchipCode: z.string().max(40).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(2).optional(),
  neighborhood: z.string().max(80).optional(),
  number: z.string().max(20).optional(),
  complement: z.string().max(80).optional(),
  addressNotes: z.string().max(500).optional(),
  photoUrl: z.string().url('URL de foto inválida').optional(),
  contactPhone: z.string().max(20).optional(),
  contactWhatsapp: z.string().max(20).optional(),
  contactEmail: z.string().email('E-mail de contato inválido').optional(),
  contactInstagram: z.string().max(60).optional(),
  behaviorNotes: z.string().max(500).optional(),
});

export const updatePetSchema = createPetSchema.partial();

export const createMedicalRecordSchema = z.object({
  type: z.enum(['MEDICATION', 'DISEASE', 'ALLERGY', 'NOTE']),
  title: z.string().min(1, 'Título é obrigatório').max(120),
  details: z.string().max(500).optional(),
  isPublic: z.boolean().optional().default(false),
});

export const createVaccineSchema = z.object({
  name: z.string().min(1, 'Nome da vacina é obrigatório').max(120),
  appliedAt: z.coerce.date(),
  nextDoseAt: z.coerce.date().optional(),
  isPublic: z.boolean().optional().default(false),
});

export type CreatePetDto = z.infer<typeof createPetSchema>;
export type UpdatePetDto = z.infer<typeof updatePetSchema>;
export type CreateMedicalRecordDto = z.infer<typeof createMedicalRecordSchema>;
export type CreateVaccineDto = z.infer<typeof createVaccineSchema>;
