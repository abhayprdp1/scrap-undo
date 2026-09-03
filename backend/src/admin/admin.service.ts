import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateCardDto, UpdateRateCardDto, UpdateKycStatusDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createRateCard(dto: CreateRateCardDto) {
    return this.prisma.scrapRateCard.upsert({
      where: {
        category_subcategory_cityZone: {
          category: dto.category,
          subcategory: dto.subcategory,
          cityZone: dto.cityZone,
        },
      },
      update: {
        minRate: dto.minRate,
        maxRate: dto.maxRate,
        unit: dto.unit,
      },
      create: dto,
    });
  }

  async updateRateCard(id: string, dto: UpdateRateCardDto) {
    const card = await this.prisma.scrapRateCard.findUnique({ where: { id } });
    if (!card) throw new NotFoundException('Rate card not found');

    return this.prisma.scrapRateCard.update({
      where: { id },
      data: {
        ...(dto.minRate !== undefined && { minRate: dto.minRate }),
        ...(dto.maxRate !== undefined && { maxRate: dto.maxRate }),
      },
    });
  }

  async deleteRateCard(id: string) {
    return this.prisma.scrapRateCard.delete({ where: { id } });
  }

  async getAllDealers() {
    return this.prisma.dealer.findMany({
      include: {
        user: { select: { name: true, phone: true, address: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateDealerKyc(dealerId: string, dto: UpdateKycStatusDto) {
    return this.prisma.dealer.update({
      where: { id: dealerId },
      data: { kycStatus: dto.status },
    });
  }

  async getPlatformStats() {
    const [totalUsers, totalDealers, totalListings, totalBookings, transactions] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.dealer.count(),
        this.prisma.listing.count(),
        this.prisma.booking.count(),
        this.prisma.transaction.findMany(),
      ]);

    const totalTransactionVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers,
      totalDealers,
      totalListings,
      totalBookings,
      totalTransactionVolume: Math.round(totalTransactionVolume),
      completedPickups: transactions.length,
    };
  }
}
