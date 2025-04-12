import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ensureDir, remove } from 'fs-extra';
import { join } from 'path';
import { StorageService } from './interfaces/storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
    constructor(private readonly configService: ConfigService) { }

    get uploadPath(): string {
        return this.configService.get<string>('storage.destination', './uploads');
    }

    async saveFile(file: Express.Multer.File): Promise<string> {
        await ensureDir(this.uploadPath);
        // Generate a unique filename if not provided
        const filename = file.filename || `${Date.now()}-${file.originalname}`;
        return filename;
    }

    async deleteFile(filename: string): Promise<void> {
        const filePath = join(this.uploadPath, filename);
        await remove(filePath);
    }
}