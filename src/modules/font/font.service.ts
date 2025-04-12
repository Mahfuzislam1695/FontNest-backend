import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FontsRepository } from './fonts.repository';
import { Font } from './entities/font.entity';
import { StorageService } from 'src/storage/interfaces/storage.interface';


@Injectable()
export class FontsService {
  constructor(
    private readonly repository: FontsRepository,
    @Inject('StorageService')
    private readonly storageService: StorageService,
  ) { }

  async uploadFont(file: Express.Multer.File): Promise<Font> {
    if (!file.originalname.toLowerCase().endsWith('.ttf')) {
      await this.storageService.deleteFile(file.filename);
      throw new BadRequestException('Only TTF files are allowed');
    }

    try {
      const filename = file.filename || file.originalname;
      // Use the storageService's uploadPath getter
      const path = file.path || `${this.storageService.uploadPath}/${filename}`;

      return this.repository.create({
        name: file.originalname.replace('.ttf', ''),
        filename,
        path,
      });
    } catch (error) {
      await this.storageService.deleteFile(file.filename);
      throw error;
    }
  }

  async findAll(): Promise<Font[]> {
    return this.repository.findAll();
  }

  async delete(id: string): Promise<Font> {
    const font = await this.repository.delete(id);
    await this.storageService.deleteFile(font.filename);
    return font;
  }
}