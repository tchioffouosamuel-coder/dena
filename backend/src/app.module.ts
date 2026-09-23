import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DishesModule } from './dishes/dishes.module';
import { OrdersModule } from './orders/orders.module';
import { MediaModule } from './media/media.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Protection anti-abus globale : 100 requêtes / minute / IP par défaut
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Sert les images uploadées sur /media/*
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', process.env.MEDIA_LOCAL_PATH || 'uploads'),
      serveRoot: '/media',
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    DishesModule,
    OrdersModule,
    MediaModule,
    StatsModule,
  ],
})
export class AppModule {}
