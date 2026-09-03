import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ListingsService } from './listings.service';
import { CreateListingDto, ConfirmItemsDto } from './dto/listing.dto';
import { User } from '@prisma/client';

@ApiTags('Listings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new listing' })
  create(@Body() dto: CreateListingDto, @CurrentUser() user: User) {
    return this.listingsService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all listings for current seller' })
  findAll(@CurrentUser() user: User) {
    return this.listingsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID (includes detection & price results)' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.listingsService.findOne(id, user);
  }

  @Post(':id/upload-url')
  @ApiOperation({ summary: 'Get pre-signed S3 URL for image upload' })
  getUploadUrl(
    @Param('id') id: string,
    @Query('fileName') fileName: string,
    @CurrentUser() user: User,
  ) {
    return this.listingsService.getUploadUrl(id, fileName, user);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Confirm image uploaded and trigger AI detection' })
  addImage(
    @Param('id') id: string,
    @Body('key') key: string,
    @CurrentUser() user: User,
  ) {
    return this.listingsService.addImage(id, key, user);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Confirm/correct detected items' })
  confirmItems(
    @Param('id') id: string,
    @Body() dto: ConfirmItemsDto,
    @CurrentUser() user: User,
  ) {
    return this.listingsService.confirmItems(id, dto, user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a listing' })
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.listingsService.cancelListing(id, user);
  }
}
