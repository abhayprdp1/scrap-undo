import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DealersModule } from './dealers/dealers.module';
import { ListingsModule } from './listings/listings.module';
import { DetectionModule } from './detection/detection.module';
import { PricingModule } from './pricing/pricing.module';
import { BookingsModule } from './bookings/bookings.module';
import { RatingsModule } from './ratings/ratings.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    DealersModule,
    ListingsModule,
    DetectionModule,
    PricingModule,
    BookingsModule,
    RatingsModule,
    AdminModule,
  ],
})
export class AppModule {}
