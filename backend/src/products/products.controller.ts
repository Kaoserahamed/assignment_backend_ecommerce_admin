import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Products

  @Post()
  @RequirePermissions('products.create')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  @RequirePermissions('products.view')
  async getAllProducts(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('active') active?: string,
    @Query('featured') featured?: string,
  ) {
    const activeBoolean = active === 'true' ? true : active === 'false' ? false : undefined;
    const featuredBoolean = featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.productsService.getAllProducts(
      page,
      limit,
      search,
      categoryId,
      brandId,
      activeBoolean,
      featuredBoolean,
    );
  }

  @Get(':id')
  @RequirePermissions('products.view')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Put(':id')
  @RequirePermissions('products.update')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('products.delete')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  // Product Variants (nested routes)

  @Post(':id/variants')
  @RequirePermissions('products.create')
  async createVariant(
    @Param('id') productId: string,
    @Body() dto: CreateVariantDto,
  ) {
    return this.productsService.createVariant(productId, dto);
  }

  @Get(':id/variants')
  @RequirePermissions('products.view')
  async getProductVariants(@Param('id') productId: string) {
    return this.productsService.getProductVariants(productId);
  }

  @Get(':id/variants/:variantId')
  @RequirePermissions('products.view')
  async getVariantById(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.getVariantById(productId, variantId);
  }

  @Put(':id/variants/:variantId')
  @RequirePermissions('products.update')
  async updateVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: Partial<CreateVariantDto>,
  ) {
    return this.productsService.updateVariant(productId, variantId, dto);
  }

  @Delete(':id/variants/:variantId')
  @RequirePermissions('products.delete')
  async deleteVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.deleteVariant(productId, variantId);
  }
}
