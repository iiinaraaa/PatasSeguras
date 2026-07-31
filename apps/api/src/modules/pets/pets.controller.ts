import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { PetsService } from './pets.service';
import {
  createPetSchema,
  updatePetSchema,
  createMedicalRecordSchema,
  createVaccineSchema,
  type CreatePetDto,
  type UpdatePetDto,
  type CreateMedicalRecordDto,
  type CreateVaccineDto,
} from './dto/pets.schemas';

@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body(new ZodValidationPipe(createPetSchema)) dto: CreatePetDto,
  ) {
    return this.petsService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.petsService.findAllByOwner(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.petsService.findOneOwned(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePetSchema)) dto: UpdatePetDto,
  ) {
    return this.petsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.petsService.remove(userId, id);
  }

  @Post(':id/medical-records')
  addMedicalRecord(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createMedicalRecordSchema)) dto: CreateMedicalRecordDto,
  ) {
    return this.petsService.addMedicalRecord(userId, id, dto);
  }

  @Post(':id/vaccines')
  addVaccine(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createVaccineSchema)) dto: CreateVaccineDto,
  ) {
    return this.petsService.addVaccine(userId, id, dto);
  }
}
