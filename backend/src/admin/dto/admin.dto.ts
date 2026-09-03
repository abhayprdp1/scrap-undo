import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KycStatus, RateSource } from '@prisma/client';

export class CreateRateCardDto {
  @ApiProperty({ example: 'Metal' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Copper' })
  @IsString()
  subcategory: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  cityZone: string;

  @ApiProperty({ example: 'kg', default: 'kg' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 450 })
  @IsNumber()
  minRate: number;

  @ApiProperty({ example: 550 })
  @IsNumber()
  maxRate: number;

  @ApiProperty({ enum: RateSource, default: RateSource.MANUAL, required: false })
  @IsEnum(RateSource)
  @IsOptional()
  source?: RateSource;
}

export class UpdateRateCardDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minRate?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxRate?: number;
}

export class UpdateKycStatusDto {
  @ApiProperty({ enum: KycStatus })
  @IsEnum(KycStatus)
  status: KycStatus;
}
