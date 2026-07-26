import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // Permission Groups

  @Post('groups')
  @RequirePermissions('permissions.create')
  async createPermissionGroup(@Body() dto: CreatePermissionGroupDto) {
    return this.permissionsService.createPermissionGroup(dto);
  }

  @Get('groups')
  @RequirePermissions('permissions.view')
  async getAllPermissionGroups() {
    return this.permissionsService.getAllPermissionGroups();
  }

  @Get('groups/:id')
  @RequirePermissions('permissions.view')
  async getPermissionGroupById(@Param('id') id: string) {
    return this.permissionsService.getPermissionGroupById(id);
  }

  @Put('groups/:id')
  @RequirePermissions('permissions.update')
  async updatePermissionGroup(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionGroupDto,
  ) {
    return this.permissionsService.updatePermissionGroup(id, dto);
  }

  @Delete('groups/:id')
  @RequirePermissions('permissions.delete')
  async deletePermissionGroup(@Param('id') id: string) {
    return this.permissionsService.deletePermissionGroup(id);
  }

  // Permissions

  @Post()
  @RequirePermissions('permissions.create')
  async createPermission(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.createPermission(dto);
  }

  @Get()
  @RequirePermissions('permissions.view')
  async getAllPermissions(@Query('groupId') groupId?: string) {
    return this.permissionsService.getAllPermissions(groupId);
  }

  @Get(':id')
  @RequirePermissions('permissions.view')
  async getPermissionById(@Param('id') id: string) {
    return this.permissionsService.getPermissionById(id);
  }

  @Put(':id')
  @RequirePermissions('permissions.update')
  async updatePermission(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePermissionDto>,
  ) {
    return this.permissionsService.updatePermission(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('permissions.delete')
  async deletePermission(@Param('id') id: string) {
    return this.permissionsService.deletePermission(id);
  }
}
