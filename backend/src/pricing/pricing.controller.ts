import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PricingService } from './pricing.service';

@ApiTags('Pricing')
@Controller('rates')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Get()
  @ApiOperation({ summary: 'Get current scrap rates by city and category' })
  getRates(
    @Query('city') city?: string,
    @Query('category') category?: string,
  ) {
    return this.pricingService.getAllRates(city, category);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate estimated scrap price range' })
  calculate(
    @Body('items') items: { category: string; subcategory: string; estQty?: number; unit?: string }[],
    @Body('cityZone') cityZone: string = 'Mumbai',
  ) {
    return this.pricingService.calculatePriceRange(items, cityZone);
  }
}
