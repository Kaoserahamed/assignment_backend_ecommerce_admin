import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('roles.create')
  async createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Get()
  @RequirePermissions('roles.view')
  async getAllRoles(@Query('includeInactive') includeInactive?: string) {
    return this.rolesService.getAllRoles(includeInactive === 'true');
  }

  @Get(':id')
  @RequirePermissions('roles.view')
  async getRoleById(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @Put(':id')
  @RequirePermissions('roles.update')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('roles.delete')
  async deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }

  @Post(':id/permissions')
  @RequirePermissions('roles.update')
  async assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto);
  }

  @Get(':id/permissions')
  @RequirePermissions('roles.view')
  async getRolePermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(id);
  }
}
