import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { DetectionModule } from '../detection/detection.module';
import { PricingModule } from '../pricing/pricing.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DetectionModule, PricingModule, StorageModule],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
