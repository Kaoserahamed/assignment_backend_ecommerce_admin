import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-value.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  // Attributes

  @Post()
  @RequirePermissions('attributes.create')
  async createAttribute(@Body() dto: CreateAttributeDto) {
    return this.attributesService.createAttribute(dto);
  }

  @Get()
  @RequirePermissions('attributes.view')
  async getAllAttributes() {
    return this.attributesService.getAllAttributes();
  }

  @Get(':id')
  @RequirePermissions('attributes.view')
  async getAttributeById(@Param('id') id: string) {
    return this.attributesService.getAttributeById(id);
  }

  @Put(':id')
  @RequirePermissions('attributes.update')
  async updateAttribute(@Param('id') id: string, @Body() dto: UpdateAttributeDto) {
    return this.attributesService.updateAttribute(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('attributes.delete')
  async deleteAttribute(@Param('id') id: string) {
    return this.attributesService.deleteAttribute(id);
  }

  // Attribute Values (nested routes)

  @Post(':id/values')
  @RequirePermissions('attributes.create')
  async createAttributeValue(
    @Param('id') attributeId: string,
    @Body() dto: CreateAttributeValueDto,
  ) {
    return this.attributesService.createAttributeValue(attributeId, dto);
  }

  @Get(':id/values')
  @RequirePermissions('attributes.view')
  async getAttributeValues(@Param('id') attributeId: string) {
    return this.attributesService.getAttributeValues(attributeId);
  }

  @Get(':id/values/:valueId')
  @RequirePermissions('attributes.view')
  async getAttributeValueById(
    @Param('id') attributeId: string,
    @Param('valueId') valueId: string,
  ) {
    return this.attributesService.getAttributeValueById(attributeId, valueId);
  }

  @Put(':id/values/:valueId')
  @RequirePermissions('attributes.update')
  async updateAttributeValue(
    @Param('id') attributeId: string,
    @Param('valueId') valueId: string,
    @Body() dto: Partial<CreateAttributeValueDto>,
  ) {
    return this.attributesService.updateAttributeValue(attributeId, valueId, dto);
  }

  @Delete(':id/values/:valueId')
  @RequirePermissions('attributes.delete')
  async deleteAttributeValue(
    @Param('id') attributeId: string,
    @Param('valueId') valueId: string,
  ) {
    return this.attributesService.deleteAttributeValue(attributeId, valueId);
  }
}
