import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DealersService } from './dealers.service';
import { CreateDealerProfileDto, UpdateDealerProfileDto } from './dto/dealer.dto';
import { User } from '@prisma/client';

@ApiTags('Dealers')
@Controller('dealers')
export class DealersController {
  constructor(private dealersService: DealersService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby active scrap dealers by coordinates and category' })
  findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('category') category?: string,
  ) {
    return this.dealersService.findNearby(Number(lat), Number(lng), category);
  }

  @Post('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create dealer shop profile' })
  createProfile(@Body() dto: CreateDealerProfileDto, @CurrentUser() user: User) {
    return this.dealersService.createProfile(dto, user);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current dealer profile' })
  getProfile(@CurrentUser() user: User) {
    return this.dealersService.getProfile(user);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update dealer shop profile' })
  updateProfile(@Body() dto: UpdateDealerProfileDto, @CurrentUser() user: User) {
    return this.dealersService.updateProfile(dto, user);
  }

  @Get('jobs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get nearby scrap pickup requests (dealer job marketplace)' })
  getMarketplaceJobs(@CurrentUser() user: User) {
    return this.dealersService.getMarketplaceJobs(user);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get dealer earnings and performance metrics' })
  getStats(@CurrentUser() user: User) {
    return this.dealersService.getDealerStats(user);
  }
}
