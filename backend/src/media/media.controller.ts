import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @RequirePermissions('media:upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.mediaService.uploadMedia(file, dto.type, user.userId, dto.altText, dto.title);
  }

  @Get()
  @RequirePermissions('media:read')
  async getAllMedia(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.mediaService.getAllMedia(page, limit, type, search);
  }

  @Get(':id')
  @RequirePermissions('media:read')
  async getMediaById(@Param('id') id: string) {
    return this.mediaService.getMediaById(id);
  }

  @Put(':id')
  @RequirePermissions('media:write')
  async updateMedia(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.updateMedia(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('media:delete')
  async deleteMedia(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }
}
