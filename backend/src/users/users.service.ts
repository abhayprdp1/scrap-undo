import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(user: User) {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: { dealer: true },
    });
  }

  async updateMe(dto: UpdateUserDto, user: User) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.address && { address: dto.address }),
        ...(dto.geoLat !== undefined && { geoLat: dto.geoLat }),
        ...(dto.geoLng !== undefined && { geoLng: dto.geoLng }),
      },
      include: { dealer: true },
    });
  }

  async getSellerImpact(user: User) {
    // Fetch completed bookings for this seller
    const completedBookings = await this.prisma.booking.findMany({
      where: {
        sellerId: user.id,
        status: { in: ['COLLECTED', 'PAID'] },
      },
      include: {
        listing: { include: { items: true } },
        transaction: true,
      },
    });

    let totalWeightKg = 0;
    let totalEarnings = 0;
    let co2SavedKg = 0;
    let treesSaved = 0;

    for (const booking of completedBookings) {
      if (booking.transaction) {
        totalEarnings += booking.transaction.amount;
      }

      for (const item of booking.listing.items) {
        const qty = item.estQty || 1;
        if (item.unit === 'kg') {
          totalWeightKg += qty;
          if (item.category === 'Paper') {
            co2SavedKg += qty * 1.5;
            treesSaved += qty * 0.017; // ~17 trees per ton of paper
          } else if (item.category === 'Metal') {
            co2SavedKg += qty * 4.0;
          } else if (item.category === 'Plastic') {
            co2SavedKg += qty * 2.1;
          }
        } else {
          // piece items like TV, laptop
          totalWeightKg += qty * 5;
          co2SavedKg += qty * 12.0;
        }
      }
    }

    return {
      completedPickups: completedBookings.length,
      totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      totalEarnings: Math.round(totalEarnings),
      co2SavedKg: Math.round(co2SavedKg * 10) / 10,
      treesSaved: Math.round(treesSaved * 10) / 10,
    };
  }
}
