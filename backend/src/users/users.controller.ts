import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('users.create')
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  @RequirePermissions('users.view')
  async getAllUsers(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
    @Query('active') active?: string,
  ) {
    const activeBoolean = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.usersService.getAllUsers(page, limit, search, roleId, activeBoolean);
  }

  @Get(':id')
  @RequirePermissions('users.view')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @RequirePermissions('users.update')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateUser(id, dto, user.userId);
  }

  @Delete(':id')
  @RequirePermissions('users.delete')
  async deleteUser(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.deleteUser(id, user.userId);
  }
}
