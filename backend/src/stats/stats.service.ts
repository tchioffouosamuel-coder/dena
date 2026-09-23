import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [orderCount, revenueAgg] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    const revenue = revenueAgg._sum.total || 0;
    const avgBasket = orderCount ? Math.round(revenue / orderCount) : 0;

    // Top des plats les plus commandés, agrégé directement en SQL (rapide même à grande échelle)
    const topDishes = await this.prisma.orderItem.groupBy({
      by: ['name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    return {
      orderCount,
      revenue,
      avgBasket,
      topDishes: topDishes.map((d) => ({ name: d.name, quantity: d._sum.quantity || 0 })),
    };
  }
}
