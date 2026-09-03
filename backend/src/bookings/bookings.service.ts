import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, VerifyPickupOtpDto } from './dto/booking.dto';
import { User, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto, user: User) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { booking: true },
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.sellerId !== user.id) throw new ForbiddenException();
    if (listing.booking) throw new BadRequestException('Listing already has a booking');

    // If dealerId not provided, assign to first nearby/available active dealer
    let dealerId = dto.dealerId;
    if (!dealerId) {
      const defaultDealer = await this.prisma.dealer.findFirst({
        where: { isActive: true },
      });
      if (!defaultDealer) throw new BadRequestException('No active scrap dealers available right now');
      dealerId = defaultDealer.id;
    }

    // Generate 4-digit pickup confirmation OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const booking = await this.prisma.booking.create({
      data: {
        listingId: listing.id,
        dealerId,
        sellerId: user.id,
        status: BookingStatus.REQUESTED,
        slotStart: new Date(dto.slotStart),
        slotEnd: new Date(dto.slotEnd),
        otpCode,
        notes: dto.notes,
      },
      include: {
        listing: { include: { items: true } },
        dealer: { include: { user: { select: { name: true, phone: true } } } },
        seller: { select: { name: true, phone: true, address: true } },
      },
    });

    await this.prisma.listing.update({
      where: { id: listing.id },
      data: { status: 'BOOKED' },
    });

    return booking;
  }

  async accept(bookingId: string, user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (!dealer) throw new ForbiddenException('Only registered dealers can accept bookings');

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== BookingStatus.REQUESTED) {
      throw new BadRequestException('Booking cannot be accepted in its current status');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        dealerId: dealer.id,
        status: BookingStatus.ACCEPTED,
      },
      include: {
        listing: { include: { items: true } },
        seller: { select: { name: true, phone: true, address: true } },
      },
    });
  }

  async markEnRoute(bookingId: string, user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (!dealer) throw new ForbiddenException();

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException();
    if (booking.dealerId !== dealer.id) throw new ForbiddenException();

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.EN_ROUTE },
    });
  }

  async verifyPickupOtp(bookingId: string, dto: VerifyPickupOtpDto, user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (!dealer) throw new ForbiddenException('Only assigned dealer can verify pickup');

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.dealerId !== dealer.id) throw new ForbiddenException('Not assigned to this booking');

    if (booking.otpCode !== dto.otpCode) {
      throw new BadRequestException('Invalid OTP code. Please ask seller for the pickup code.');
    }

    // Complete the booking and create transaction
    const [updatedBooking] = await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.COLLECTED,
          otpVerified: true,
          finalAmount: dto.finalAmount,
        },
      }),
      this.prisma.listing.update({
        where: { id: booking.listingId },
        data: { status: 'COLLECTED' },
      }),
      this.prisma.transaction.create({
        data: {
          bookingId,
          amount: dto.finalAmount,
          mode: 'CASH',
          collectedAt: new Date(),
          sellerConfirmed: true,
          dealerConfirmed: true,
        },
      }),
    ]);

    return updatedBooking;
  }

  async findForSeller(user: User) {
    return this.prisma.booking.findMany({
      where: { sellerId: user.id },
      include: {
        listing: { include: { items: true } },
        dealer: { include: { user: { select: { name: true, phone: true } } } },
        transaction: true,
        ratings: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForDealer(user: User) {
    const dealer = await this.prisma.dealer.findUnique({
      where: { userId: user.id },
    });
    if (!dealer) throw new ForbiddenException();

    return this.prisma.booking.findMany({
      where: { dealerId: dealer.id },
      include: {
        listing: { include: { items: true } },
        seller: { select: { name: true, phone: true, address: true } },
        transaction: true,
        ratings: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        listing: { include: { items: true } },
        dealer: { include: { user: { select: { name: true, phone: true } } } },
        seller: { select: { name: true, phone: true, address: true } },
        transaction: true,
        ratings: true,
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const dealer = await this.prisma.dealer.findUnique({ where: { userId: user.id } });
    const isSeller = booking.sellerId === user.id;
    const isDealer = dealer && booking.dealerId === dealer.id;
    const isAdmin = (user as any).role === 'ADMIN';

    if (!isSeller && !isDealer && !isAdmin) {
      throw new ForbiddenException();
    }

    // Mask OTP code for dealer until verified
    if (isDealer && !booking.otpVerified) {
      return { ...booking, otpCode: undefined };
    }

    return booking;
  }

  async cancel(id: string, user: User) {
    const booking = await this.findOne(id, user);
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
