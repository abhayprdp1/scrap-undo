import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DetectionService } from './detection.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Detection')
@Controller('detection')
export class DetectionController {
  constructor(private detectionService: DetectionService) {}

  @Post('analyze')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Analyze image URL with Gemini Vision API' })
  analyze(@Body('imageUrl') imageUrl: string) {
    return this.detectionService.analyze(imageUrl);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all valid scrap categories (public)' })
  getCategories() {
    return this.detectionService.getCategories();
  }
}
