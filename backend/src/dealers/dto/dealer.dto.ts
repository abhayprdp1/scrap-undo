import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDealerProfileDto {
  @ApiProperty({ example: 'Ramesh Scrap Works' })
  @IsString()
  shopName: string;

  @ApiProperty({ example: ['Electronics', 'Metal', 'Paper'] })
  @IsArray()
  categories: string[];

  @ApiProperty({ example: 10, default: 10 })
  @IsNumber()
  @IsOptional()
  serviceRadiusKm?: number;

  @ApiProperty({ example: 19.076 })
  @IsNumber()
  geoLat: number;

  @ApiProperty({ example: 72.8777 })
  @IsNumber()
  geoLng: number;
}

export class UpdateDealerProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  serviceRadiusKm?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  geoLat?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  geoLng?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
