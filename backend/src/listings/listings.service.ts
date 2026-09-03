import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DetectionService } from '../detection/detection.service';
import { PricingService } from '../pricing/pricing.service';
import { S3Service } from '../storage/s3.service';
import { CreateListingDto, ConfirmItemsDto } from './dto/listing.dto';
import { User } from '@prisma/client';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private detection: DetectionService,
    private pricing: PricingService,
    private s3: S3Service,
  ) {}

  async create(dto: CreateListingDto, user: User) {
    return this.prisma.listing.create({
      data: {
        sellerId: user.id,
        geoLat: dto.geoLat,
        geoLng: dto.geoLng,
        address: dto.address,
        notes: dto.notes,
        status: 'DRAFT',
        images: [],
      },
      include: { items: true },
    });
  }

  async getUploadUrl(listingId: string, fileName: string, user: User) {
    const listing = await this.findOne(listingId, user);
    const key = `listings/${listingId}/${Date.now()}-${fileName}`;
    const url = await this.s3.getPresignedUrl(key, 'image/jpeg');
    return { uploadUrl: url, key };
  }

  async addImage(listingId: string, key: string, user: User) {
    const listing = await this.findOne(listingId, user);
    const imageUrl = this.s3.getPublicUrl(key);

    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        images: { push: imageUrl },
        status: 'DETECTING',
      },
    });

    // Trigger async detection
    this.triggerDetection(listingId, imageUrl, user.address || 'Mumbai').catch(
      console.error,
    );

    return updated;
  }

  private async triggerDetection(listingId: string, imageUrl: string, city: string) {
    try {
      const detections = await this.detection.analyze(imageUrl);
      await this.prisma.listing.update({
        where: { id: listingId },
        data: { detectedItems: detections as any, status: 'PRICED' },
      });

      // Auto-create listing items from detections
      for (const det of detections) {
        if (det.confidence >= 0.5) {
          const rates = await this.pricing.getRates(det.category, det.subcategory, city);
          if (rates) {
            await this.prisma.listingItem.create({
              data: {
                listingId,
                category: det.category,
                subcategory: det.subcategory,
                priceMin: rates.minRate,
                priceMax: rates.maxRate,
                unit: rates.unit,
                confidenceScore: det.confidence,
                condition: det.condition,
              },
            });
          }
        }
      }
    } catch (err) {
      console.error('Detection failed:', err);
      await this.prisma.listing.update({
        where: { id: listingId },
        data: { status: 'DRAFT' },
      });
    }
  }

  async confirmItems(listingId: string, dto: ConfirmItemsDto, user: User) {
    const listing = await this.findOne(listingId, user);
    const cityZone = user.address?.split(',').pop()?.trim() || 'Mumbai';

    // Remove old auto-detected items
    await this.prisma.listingItem.deleteMany({ where: { listingId } });

    // Create confirmed items with prices
    for (const item of dto.items) {
      const rates = await this.pricing.getRates(item.category, item.subcategory, cityZone);
      await this.prisma.listingItem.create({
        data: {
          listingId,
          category: item.category,
          subcategory: item.subcategory,
          estQty: item.estQty,
          unit: item.unit || rates?.unit || 'kg',
          priceMin: rates?.minRate || 0,
          priceMax: rates?.maxRate || 0,
          condition: item.condition,
          userConfirmed: true,
        },
      });
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data: { status: 'PRICED' },
      include: { items: true },
    });
  }

  async findAll(user: User) {
    return this.prisma.listing.findMany({
      where: { sellerId: user.id },
      include: { items: true, booking: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: User) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { items: true, booking: true },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== user.id && (user as any).role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    return listing;
  }

  async cancelListing(id: string, user: User) {
    await this.findOne(id, user);
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
