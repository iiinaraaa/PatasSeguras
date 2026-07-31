import { Controller, Get, Param } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public/pets')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.publicService.getPetBySlug(slug);
  }
}
