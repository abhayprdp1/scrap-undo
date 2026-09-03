import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async getRates(category: string, subcategory: string, cityZone: string) {
    // Try exact city match first
    let rate = await this.prisma.scrapRateCard.findFirst({
      where: {
        category,
        subcategory,
        cityZone,
        isActive: true,
      },
    });

    // Fallback to Mumbai rates
    if (!rate) {
      rate = await this.prisma.scrapRateCard.findFirst({
        where: {
          category,
          subcategory,
          cityZone: 'Mumbai',
          isActive: true,
        },
      });
    }

    return rate;
  }

  async getAllRates(cityZone?: string, category?: string) {
    return this.prisma.scrapRateCard.findMany({
      where: {
        ...(cityZone && { cityZone }),
        ...(category && { category }),
        isActive: true,
      },
      orderBy: [{ category: 'asc' }, { subcategory: 'asc' }],
    });
  }

  async calculatePriceRange(
    items: { category: string; subcategory: string; estQty?: number; unit?: string }[],
    cityZone: string,
  ) {
    let totalMin = 0;
    let totalMax = 0;

    const breakdown = await Promise.all(
      items.map(async (item) => {
        const rate = await this.getRates(item.category, item.subcategory, cityZone);
        if (!rate) return null;

        const qty = item.estQty || 1;
        const itemMin = qty * rate.minRate;
        const itemMax = qty * rate.maxRate;
        totalMin += itemMin;
        totalMax += itemMax;

        return {
          category: item.category,
          subcategory: item.subcategory,
          qty,
          unit: rate.unit,
          rateMin: rate.minRate,
          rateMax: rate.maxRate,
          priceMin: itemMin,
          priceMax: itemMax,
        };
      }),
    );

    return {
      items: breakdown.filter(Boolean),
      totalMin: Math.round(totalMin),
      totalMax: Math.round(totalMax),
      currency: 'INR',
      disclaimer: 'Estimated — final price confirmed by dealer on inspection',
    };
  }
}
