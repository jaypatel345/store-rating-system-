import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  async create(@Body() createRatingDto: CreateRatingDto, @CurrentUser() user: any) {
    return this.ratingsService.create(createRatingDto, user.id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  async update(@Param('id') id: string, @Body() createRatingDto: CreateRatingDto, @CurrentUser() user: any) {
    return this.ratingsService.update(id, createRatingDto, user.id);
  }

  @Get('store/:storeId')
  async findByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findByStore(storeId);
  }

  @Get('store/:storeId/average')
  async getStoreAverageRating(@Param('storeId') storeId: string) {
    return this.ratingsService.getStoreAverageRating(storeId);
  }

  @Get('owner/dashboard')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  async getStoreOwnerDashboard(@CurrentUser() user: any) {
    return this.ratingsService.getStoreOwnerDashboard(user.id);
  }

  @Get('user')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  async findByUser(@CurrentUser() user: any) {
    return this.ratingsService.findByUser(user.id);
  }
}
