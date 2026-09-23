import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Le prix vient toujours de la base de données, jamais du client :
  // ça empêche un client malveillant de modifier le total en manipulant la requête.
  async create(dto: CreateOrderDto) {
    const dishIds = dto.items.map((i) => i.dishId);
    const dishes = await this.prisma.dish.findMany({ where: { id: { in: dishIds } } });

    if (dishes.length !== new Set(dishIds).size) {
      throw new BadRequestException("Un ou plusieurs plats de la commande sont introuvables.");
    }

    const items = dto.items.map((input) => {
      const dish = dishes.find((d) => d.id === input.dishId)!;
      return { dishId: dish.id, name: dish.name, price: dish.price, quantity: input.quantity };
    });

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return this.prisma.order.create({
      data: {
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        total,
        items: { create: items },
      },
      include: { items: true },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      take: 200,
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Commande introuvable');
    return this.prisma.order.update({ where: { id }, data: { status } });
  }
}
