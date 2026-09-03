import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @ApiProperty()
  @IsNumber()
  geoLat: number;

  @ApiProperty()
  @IsNumber()
  geoLng: number;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ConfirmItemDto {
  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  subcategory: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  estQty?: number;

  @ApiProperty({ default: 'kg' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  condition?: string;
}

export class ConfirmItemsDto {
  @ApiProperty({ type: [ConfirmItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfirmItemDto)
  items: ConfirmItemDto[];
}
