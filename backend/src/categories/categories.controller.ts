import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @RequirePermissions('categories.create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Get()
  @RequirePermissions('categories.view')
  async getAllCategories(@Query('includeInactive') includeInactive?: string) {
    return this.categoriesService.getAllCategories(includeInactive === 'true');
  }

  @Get('tree')
  @RequirePermissions('categories.view')
  async getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Get(':id')
  @RequirePermissions('categories.view')
  async getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Put(':id')
  @RequirePermissions('categories.update')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('categories.delete')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
