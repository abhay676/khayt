import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { AuthGuard, IRequest } from 'src/shared/guards/auth.guard';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/create')
  async create(@Body() createUrlDto: CreateUrlDto, @Session() session: any) {
    createUrlDto.userId = session.userId;
    const URL: Url & { displayURL?: string } = await this.urlService.create(
      createUrlDto,
    );
    URL.displayURL = `${process.env.SERVER_URL}/${URL.shortURL}`;
    return URL;
  }

  @Get()
  findAll() {
    return this.urlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string) {
    const updatedResult = await this.urlService.update(id);
    if (!updatedResult) return new BadRequestException('no url found');
    return updatedResult;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlService.remove(+id);
  }
}
