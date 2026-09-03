import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/rating.dto';
import { User } from '@prisma/client';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit rating and feedback for completed booking' })
  create(@Body() dto: CreateRatingDto, @CurrentUser() user: User) {
    return this.ratingsService.create(dto, user);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get ratings received by a specific user' })
  getForUser(@Param('id') userId: string) {
    return this.ratingsService.getForUser(userId);
  }
}
