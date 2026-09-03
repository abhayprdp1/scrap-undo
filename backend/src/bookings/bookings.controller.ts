import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, VerifyPickupOtpDto } from './dto/booking.dto';
import { User } from '@prisma/client';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Initiate a scrap pickup booking with time slot' })
  create(@Body() dto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingsService.create(dto, user);
  }

  @Get('seller')
  @ApiOperation({ summary: 'Get all bookings for current seller' })
  findForSeller(@CurrentUser() user: User) {
    return this.bookingsService.findForSeller(user);
  }

  @Get('dealer')
  @ApiOperation({ summary: 'Get all bookings assigned to current dealer' })
  findForDealer(@CurrentUser() user: User) {
    return this.bookingsService.findForDealer(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Dealer accepts a pickup booking request' })
  accept(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.accept(id, user);
  }

  @Patch(':id/en-route')
  @ApiOperation({ summary: 'Dealer marks status as on the way' })
  markEnRoute(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.markEnRoute(id, user);
  }

  @Post(':id/verify-otp')
  @ApiOperation({ summary: 'Dealer enters seller OTP and settles cash amount' })
  verifyOtp(
    @Param('id') id: string,
    @Body() dto: VerifyPickupOtpDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.verifyPickupOtp(id, dto, user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.cancel(id, user);
  }
}
