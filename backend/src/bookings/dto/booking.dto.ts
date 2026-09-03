import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'listing-id-123' })
  @IsString()
  listingId: string;

  @ApiProperty({ example: 'dealer-id-123', required: false })
  @IsString()
  @IsOptional()
  dealerId?: string;

  @ApiProperty({ example: '2026-09-04T10:00:00Z' })
  @IsDateString()
  slotStart: string;

  @ApiProperty({ example: '2026-09-04T12:00:00Z' })
  @IsDateString()
  slotEnd: string;

  @ApiProperty({ required: false, example: 'Please call before coming' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class AcceptBookingDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class VerifyPickupOtpDto {
  @ApiProperty({ example: '4829' })
  @IsString()
  otpCode: string;

  @ApiProperty({ example: 450, description: 'Final settled cash amount after weighing' })
  @IsNumber()
  finalAmount: number;
}
