import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/rating.dto';
import { User } from '@prisma/client';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRatingDto, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { dealer: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const existing = await this.prisma.rating.findUnique({
      where: {
        bookingId_ratedBy: {
          bookingId: dto.bookingId,
          ratedBy: user.id,
        },
      },
    });
    if (existing) {
      throw new BadRequestException('You have already rated this booking');
    }

    const rating = await this.prisma.rating.create({
      data: {
        bookingId: dto.bookingId,
        ratedBy: user.id,
        ratedUserId: dto.ratedUserId,
        stars: dto.stars,
        comment: dto.comment,
      },
    });

    // If rated user is a dealer, recalculate dealer's average rating
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: dto.ratedUserId },
    });

    if (dealer) {
      const allDealerRatings = await this.prisma.rating.findMany({
        where: { ratedUserId: dto.ratedUserId },
      });
      const avg =
        allDealerRatings.reduce((sum, r) => sum + r.stars, 0) / allDealerRatings.length;
      await this.prisma.dealer.update({
        where: { id: dealer.id },
        data: {
          ratingAvg: Math.round(avg * 10) / 10,
          totalRatings: allDealerRatings.length,
        },
      });
    }

    return rating;
  }

  async getForUser(userId: string) {
    return this.prisma.rating.findMany({
      where: { ratedUserId: userId },
      include: {
        rater: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
