import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getPetBySlug(slug: string) {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { slug },
      include: {
        pet: {
          include: {
            visibility: true,
            medicalRecords: true,
            lostStatus: true,
          },
        },
      },
    });

    if (!qrCode || !qrCode.pet.isActive) {
      throw new NotFoundException('Pet não encontrado.');
    }

    const { pet } = qrCode;
    const visibility = pet.visibility;

    return {
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      photoUrl: visibility?.showPhoto ? pet.photoUrl : null,
      city: visibility?.showCity ? pet.city : null,
      contactPhone: visibility?.showPhone ? pet.contactPhone : null,
      contactWhatsapp: visibility?.showWhatsapp ? pet.contactWhatsapp : null,
      contactEmail: visibility?.showEmail ? pet.contactEmail : null,
      behaviorNotes: visibility?.showBehaviorNotes ? pet.behaviorNotes : null,
      medications: visibility?.showMedications
        ? pet.medicalRecords.filter((r) => r.type === 'MEDICATION' && r.isPublic)
        : [],
      allergies: visibility?.showAllergies
        ? pet.medicalRecords.filter((r) => r.type === 'ALLERGY' && r.isPublic)
        : [],
      diseases: visibility?.showDiseases
        ? pet.medicalRecords.filter((r) => r.type === 'DISEASE' && r.isPublic)
        : [],
      isLost: pet.lostStatus?.isLost ?? false,
      lostInfo: pet.lostStatus?.isLost
        ? {
            lastSeenLocation: pet.lostStatus.lastSeenLocation,
            notes: pet.lostStatus.notes,
            lostAt: pet.lostStatus.lostAt,
          }
        : null,
    };
  }
}
