import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealerProfileDto, UpdateDealerProfileDto } from './dto/dealer.dto';
import { User, KycStatus } from '@prisma/client';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

@Injectable()
export class DealersService {
  constructor(private prisma: PrismaService) {}

  async createProfile(dto: CreateDealerProfileDto, user: User) {
    const existing = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (existing) {
      throw new BadRequestException('Dealer profile already exists');
    }

    return this.prisma.dealer.create({
      data: {
        userId: user.id,
        shopName: dto.shopName,
        categories: dto.categories,
        serviceRadiusKm: dto.serviceRadiusKm ?? 10,
        geoLat: dto.geoLat,
        geoLng: dto.geoLng,
        kycStatus: KycStatus.VERIFIED, // Auto-verify in MVP/demo
      },
    });
  }

  async getProfile(user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
      include: {
        user: { select: { name: true, phone: true, address: true } },
      },
    });
    if (!dealer) throw new NotFoundException('Dealer profile not found');
    return dealer;
  }

  async updateProfile(dto: UpdateDealerProfileDto, user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (!dealer) throw new NotFoundException('Dealer profile not found');

    return this.prisma.dealer.update({
      where: { id: dealer.id },
      data: {
        ...(dto.shopName && { shopName: dto.shopName }),
        ...(dto.categories && { categories: dto.categories }),
        ...(dto.serviceRadiusKm !== undefined && { serviceRadiusKm: dto.serviceRadiusKm }),
        ...(dto.geoLat !== undefined && { geoLat: dto.geoLat }),
        ...(dto.geoLng !== undefined && { geoLng: dto.geoLng }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async findNearby(lat: number, lng: number, category?: string) {
    const dealers = await this.prisma.dealer.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: { select: { name: true, phone: true, address: true } },
      },
    });

    return dealers
      .map((dealer) => {
        const distance = calculateDistanceKm(lat, lng, dealer.geoLat, dealer.geoLng);
        return { ...dealer, distanceKm: distance };
      })
      .filter((dealer) => {
        const withinRadius = dealer.distanceKm <= dealer.serviceRadiusKm;
        const matchesCategory = !category || dealer.categories.includes(category);
        return withinRadius && matchesCategory;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async getMarketplaceJobs(user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (!dealer) throw new NotFoundException('Dealer profile not registered');

    // Get listings with status PRICED (available for pickup)
    const listings = await this.prisma.listing.findMany({
      where: {
        status: 'PRICED',
        booking: null,
      },
      include: {
        items: true,
        seller: { select: { name: true, phone: true, address: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute distance and filter
    return listings
      .map((listing) => {
        const distance = calculateDistanceKm(
          dealer.geoLat,
          dealer.geoLng,
          listing.geoLat,
          listing.geoLng,
        );
        const totalEstMin = listing.items.reduce((sum, i) => sum + i.priceMin * (i.estQty || 1), 0);
        const totalEstMax = listing.items.reduce((sum, i) => sum + i.priceMax * (i.estQty || 1), 0);

        return {
          ...listing,
          distanceKm: distance,
          totalEstMin: Math.round(totalEstMin),
          totalEstMax: Math.round(totalEstMax),
        };
      })
      .filter((listing) => listing.distanceKm <= (dealer.serviceRadiusKm || 25))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async getDealerStats(user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (!dealer) throw new NotFoundException('Dealer profile not found');

    const bookings = await this.prisma.booking.findMany({
      where: { dealerId: dealer.id },
      include: { transaction: true },
    });

    const completed = bookings.filter((b) => b.status === 'COLLECTED' || b.status === 'PAID');
    const totalEarnings = completed.reduce((sum, b) => sum + (b.finalAmount || 0), 0);
    const activeJobs = bookings.filter(
      (b) => b.status === 'REQUESTED' || b.status === 'ACCEPTED' || b.status === 'EN_ROUTE',
    ).length;

    return {
      totalPickups: completed.length,
      activeJobs,
      totalEarnings: Math.round(totalEarnings),
      ratingAvg: dealer.ratingAvg,
      totalRatings: dealer.totalRatings,
      kycStatus: dealer.kycStatus,
    };
  }
}
