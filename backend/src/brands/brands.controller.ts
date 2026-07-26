import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @RequirePermissions('brands.create')
  async createBrand(@Body() dto: CreateBrandDto) {
    return this.brandsService.createBrand(dto);
  }

  @Get()
  @RequirePermissions('brands.view')
  async getAllBrands(@Query('includeInactive') includeInactive?: string) {
    return this.brandsService.getAllBrands(includeInactive === 'true');
  }

  @Get(':id')
  @RequirePermissions('brands.view')
  async getBrandById(@Param('id') id: string) {
    return this.brandsService.getBrandById(id);
  }

  @Put(':id')
  @RequirePermissions('brands.update')
  async updateBrand(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.updateBrand(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('brands.delete')
  async deleteBrand(@Param('id') id: string) {
    return this.brandsService.deleteBrand(id);
  }
}
