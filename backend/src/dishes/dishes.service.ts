import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  // Public : uniquement les plats actifs, triés pour l'affichage client
  findActive() {
    return this.prisma.dish.findMany({
      where: { active: true },
      orderBy: { position: 'asc' },
    });
  }

  // Admin : tous les plats, actifs ou non
  findAll() {
    return this.prisma.dish.findMany({ orderBy: { position: 'asc' } });
  }

  async findOne(id: string) {
    const dish = await this.prisma.dish.findUnique({ where: { id } });
    if (!dish) throw new NotFoundException('Plat introuvable');
    return dish;
  }

  async create(dto: CreateDishDto) {
    const count = await this.prisma.dish.count();
    return this.prisma.dish.create({ data: { ...dto, position: dto.position ?? count + 1 } });
  }

  async update(id: string, dto: UpdateDishDto) {
    await this.findOne(id);
    return this.prisma.dish.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Suppression douce : on désactive plutôt que de supprimer,
    // pour conserver l'historique des commandes qui référencent ce plat.
    return this.prisma.dish.update({ where: { id }, data: { active: false } });
  }
}
