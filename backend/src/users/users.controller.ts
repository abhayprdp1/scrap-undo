import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { User } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile and linked dealer info' })
  getMe(@CurrentUser() user: User) {
    return this.usersService.getMe(user);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile details' })
  updateMe(@Body() dto: UpdateUserDto, @CurrentUser() user: User) {
    return this.usersService.updateMe(dto, user);
  }

  @Get('me/impact')
  @ApiOperation({ summary: 'Get cumulative eco impact (CO2, trees saved, kg recycled)' })
  getImpact(@CurrentUser() user: User) {
    return this.usersService.getSellerImpact(user);
  }
}
