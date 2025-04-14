import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { FontsRepository } from './fonts.repository';
import { Font } from './entities/font.entity';
import { StorageService } from '../../storage/interfaces/storage.interface';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { FontResponseDto } from './dto/font-response.dto';

@Injectable()
export class FontsService {
  private readonly logger = new Logger(FontsService.name);
  private readonly validExtensions = ['.ttf', '.otf'];

  constructor(
    private readonly repository: FontsRepository,
    @Inject('StorageService')
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) { }

  private fontReplacements = new Map<string, boolean>();

  async uploadFont(file: Express.Multer.File): Promise<Font> {
    if (!file) {
      throw new BadRequestException('No file uploaded or file is empty');
    }

    const fileExt = extname(file.originalname).toLowerCase();
    if (!this.validExtensions.includes(fileExt)) {
      throw new BadRequestException(`Only ${this.validExtensions.join(', ')} files are allowed`);
    }

    const fontName = file.originalname.replace(fileExt, '');
    this.fontReplacements.set(fontName, false); // Initialize as not replaced

    try {
      // Check if font with same name exists
      const existingFont = await this.repository.findByName(fontName);
      if (existingFont) {
        this.logger.log(`Found existing font with name: ${fontName}, replacing it`);
        this.fontReplacements.set(fontName, true); // Mark as replaced

        try {
          // Delete existing file first
          await this.storageService.deleteFile(existingFont.filename);
          // Delete existing database record
          await this.repository.delete(existingFont.id);
        } catch (error) {
          this.logger.error(`Failed to delete existing font: ${error.message}`);
          throw new ConflictException(`Failed to replace existing font with name '${fontName}'`);
        }
      }

      // Save new file
      const { filename, path } = await this.storageService.saveFile(file);

      // Create new database record
      const font = await this.repository.create({
        name: fontName,
        filename,
        path,
        size: file.size,
        mimetype: this.getMimeType(fileExt),
      });

      this.logger.log(`Font ${fontName} ${existingFont ? 'replaced' : 'uploaded'} successfully`);
      return font;
    } catch (error) {
      this.logger.error(`Font upload failed: ${error.message}`);
      this.fontReplacements.delete(fontName); // Clean up on failure

      // Clean up if file was partially saved
      if (file?.filename) {
        await this.storageService.deleteFile(file.filename).catch(e => {
          this.logger.error(`Failed to cleanup file: ${e.message}`);
        });
      }

      // If it's a known error type, rethrow it
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to upload font');
    }
  }

  async wasFontReplaced(file: Express.Multer.File): Promise<boolean> {
    const fileExt = extname(file.originalname).toLowerCase();
    const fontName = file.originalname.replace(fileExt, '');
    return this.fontReplacements.get(fontName) || false;
  }


  private getMimeType(ext: string): string {
    switch (ext) {
      case '.ttf': return 'font/ttf';
      case '.otf': return 'font/otf';
      default: return 'application/octet-stream';
    }
  }

  async findAll() {
    try {
      const fonts = await this.repository.findAll();

      if (!fonts || fonts.length === 0) {
        this.logger.warn('No fonts found in database');
        return [];
      }

      return fonts.map(font => ({
        ...font,
        url: this.generateFontUrl(font.filename)

      }));
    } catch (error) {
      this.logger.error(`Failed to fetch fonts: ${error.message}`);
      throw new BadRequestException('Failed to fetch fonts');
    }
  }

  private generateFontUrl(filename: string): string {
    // Use the full configuration path
    const baseUrl = this.configService.get<string>('app.baseUrl');

    if (!baseUrl) {
      this.logger.warn('BASE_URL is not configured, using fallback');
      return `http://localhost:3333/uploads/${filename}`;
    }

    return `${baseUrl}/uploads/${filename}`;
  }

  async delete(id: string): Promise<FontResponseDto> {
    try {
      const font = await this.repository.findById(id);
      if (!font) {
        throw new NotFoundException('Font not found');
      }

      // Delete file from storage
      await this.storageService.deleteFile(font.filename);

      // Delete database record
      const deletedFont = await this.repository.delete(id);

      // Format the response
      const response: FontResponseDto = {
        ...deletedFont,
        url: this.generateFontUrl(deletedFont.filename),
      };

      this.logger.log(`Font deleted successfully: ${id}`);
      return response;

    } catch (error) {
      this.logger.error(`Failed to delete font ${id}: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete font');
    }
  }

  async getFontFile(id: string): Promise<{ path: string; filename: string }> {
    try {
      const font = await this.repository.findById(id);
      if (!font) {
        throw new NotFoundException('Font not found');
      }

      if (!existsSync(font.path)) {
        throw new NotFoundException('Font file not found in storage');
      }

      return {
        path: font.path,
        filename: font.filename,
      };
    } catch (error) {
      this.logger.error(`Failed to get font file ${id}: ${error.message}`);
      throw error;
    }
  }
}