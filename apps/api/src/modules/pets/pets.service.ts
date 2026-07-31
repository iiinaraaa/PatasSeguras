import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateSlug } from './utils/slug.util';
import type {
  CreatePetDto,
  UpdatePetDto,
  CreateMedicalRecordDto,
  CreateVaccineDto,
} from './dto/pets.schemas';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreatePetDto) {
    const slug = await this.generateUniqueSlug();

    return this.prisma.pet.create({
      data: {
        ownerId,
        ...dto,
        visibility: { create: {} },
        qrCode: { create: { slug } },
      },
      include: { visibility: true, qrCode: true },
    });
  }

  async findAllByOwner(ownerId: string) {
    return this.prisma.pet.findMany({
      where: { ownerId, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { qrCode: true },
    });
  }

  async findOneOwned(ownerId: string, petId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: {
        medicalRecords: true,
        vaccines: true,
        visibility: true,
        lostStatus: true,
        qrCode: true,
      },
    });

    if (!pet || pet.ownerId !== ownerId) {
      throw new NotFoundException('Pet não encontrado.');
    }

    return pet;
  }

  async update(ownerId: string, petId: string, dto: UpdatePetDto) {
    await this.assertOwnership(ownerId, petId);

    return this.prisma.pet.update({
      where: { id: petId },
      data: dto,
    });
  }

  async remove(ownerId: string, petId: string) {
    await this.assertOwnership(ownerId, petId);

    await this.prisma.pet.update({
      where: { id: petId },
      data: { isActive: false },
    });

    return { message: 'Pet removido.' };
  }

  async addMedicalRecord(ownerId: string, petId: string, dto: CreateMedicalRecordDto) {
    await this.assertOwnership(ownerId, petId);

    return this.prisma.medicalRecord.create({
      data: { petId, ...dto },
    });
  }

  async addVaccine(ownerId: string, petId: string, dto: CreateVaccineDto) {
    await this.assertOwnership(ownerId, petId);

    return this.prisma.vaccine.create({
      data: { petId, ...dto },
    });
  }

  private async assertOwnership(ownerId: string, petId: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });

    if (!pet) {
      throw new NotFoundException('Pet não encontrado.');
    }

    if (pet.ownerId !== ownerId) {
      throw new NotFoundException('Pet não encontrado.');
    }

    return pet;
  }

  private async generateUniqueSlug(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = generateSlug();
      const existing = await this.prisma.qRCode.findUnique({ where: { slug } });
      if (!existing) return slug;
    }
    throw new Error('Não foi possível gerar um código único para o QR Code.');
  }
}
