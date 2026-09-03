import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { CreateRateCardDto, UpdateRateCardDto, UpdateKycStatusDto } from './dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('rates')
  @ApiOperation({ summary: 'Create or upsert scrap rate card' })
  createRateCard(@Body() dto: CreateRateCardDto) {
    return this.adminService.createRateCard(dto);
  }

  @Patch('rates/:id')
  @ApiOperation({ summary: 'Update scrap rate card prices' })
  updateRateCard(@Param('id') id: string, @Body() dto: UpdateRateCardDto) {
    return this.adminService.updateRateCard(id, dto);
  }

  @Delete('rates/:id')
  @ApiOperation({ summary: 'Delete scrap rate card' })
  deleteRateCard(@Param('id') id: string) {
    return this.adminService.deleteRateCard(id);
  }

  @Get('dealers')
  @ApiOperation({ summary: 'List all scrap dealers for KYC verification' })
  getAllDealers() {
    return this.adminService.getAllDealers();
  }

  @Patch('dealers/:id/kyc')
  @ApiOperation({ summary: 'Approve or reject dealer KYC' })
  updateDealerKyc(@Param('id') id: string, @Body() dto: UpdateKycStatusDto) {
    return this.adminService.updateDealerKyc(id, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get global platform statistics and transactions volume' })
  getStats() {
    return this.adminService.getPlatformStats();
  }
}
