import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';

@ApiTags('Uploads')
@Controller('uploads')
export class ImageController {
  @Get(':filename')
  serveImage(@Param('filename') filename, @Res() res): void {
    res.sendFile(filename, { root: join(__dirname, '../..', 'uploads') });
  }
}
