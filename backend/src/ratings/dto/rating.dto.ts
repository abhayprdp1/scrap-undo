import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 'booking-id-123' })
  @IsString()
  bookingId: string;

  @ApiProperty({ example: 'user-id-456' })
  @IsString()
  ratedUserId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @ApiProperty({ example: 'Punctual, polite and paid fair rates on the spot!', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
