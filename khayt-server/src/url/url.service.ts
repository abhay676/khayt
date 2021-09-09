import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private readonly urlRepo: Repository<Url>,
  ) {}
  async create(
    createUrlDto: CreateUrlDto & { shortURL?: string },
    count: number = 7,
  ): Promise<Url> {
    createUrlDto.shortURL = nanoid(count);
    const URL = this.urlRepo.create(createUrlDto);
    await this.urlRepo.save(URL);
    return URL;
  }

  findAll() {
    return `This action returns all url`;
  }

  findOne(id: string) {
    return this.urlRepo.find({ id });
  }

  async update(id: string) {
    const updateURL = await this.urlRepo.update(id, {
      isFavourite: true,
      updatedAt: new Date(),
    });
    if (updateURL.affected) {
      return this.findOne(id);
    }
    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
