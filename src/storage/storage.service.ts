import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ensureDir } from 'fs-extra';
import { writeFile, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { StorageService } from './interfaces/storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
    constructor(private readonly configService: ConfigService) { }

    get uploadPath(): string {
        return join(process.cwd(), this.configService.get<string>('STORAGE_DESTINATION', 'uploads'));
    }

    async saveFile(file: Express.Multer.File): Promise<{ filename: string; path: string }> {
        try {
            // Ensure upload directory exists
            await ensureDir(this.uploadPath);

            // Generate unique filename
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const ext = extname(file.originalname);
            const sanitizedOriginalName = file.originalname.replace(/[^\w.-]/g, '_');
            const filename = `${sanitizedOriginalName.replace(ext, '')}-${uniqueSuffix}${ext}`;
            const absolutePath = join(this.uploadPath, filename);
            const relativePath = `/uploads/${filename}`; // Relative path for database

            // Save file to disk
            await writeFile(absolutePath, file.buffer);

            return {
                filename,
                path: relativePath // Return relative path instead of absolute
            };
        } catch (error) {
            throw new Error(`Failed to save file: ${error.message}`);
        }
    }

    async deleteFile(filename: string): Promise<void> {
        try {
            const absolutePath = join(this.uploadPath, filename);
            await unlink(absolutePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw new Error(`Failed to delete file: ${error.message}`);
            }
        }
    }

    getAbsolutePath(relativePath: string): string {
        // Convert relative path (/uploads/filename) to absolute path
        if (relativePath.startsWith('/uploads/')) {
            return join(this.uploadPath, relativePath.substring('/uploads/'.length));
        }
        return join(this.uploadPath, relativePath);
    }
}
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ensureDir, remove } from 'fs-extra';
// import { createWriteStream } from 'fs';
// import { join } from 'path';
// import { promisify } from 'util';
// import { pipeline } from 'stream';
// import { StorageService } from './interfaces/storage.interface';

// const pump = promisify(pipeline);

// @Injectable()
// export class LocalStorageService implements StorageService {
//     constructor(private readonly configService: ConfigService) { }

//     get uploadPath(): string {
//         return join(process.cwd(), this.configService.get<string>('STORAGE_DESTINATION', 'uploads'));
//     }

//     async saveFile(file: Express.Multer.File): Promise<{ filename: string; path: string }> {
//         await ensureDir(this.uploadPath);

//         const filename = `${Date.now()}-${file.originalname}`;
//         const absolutePath = join(this.uploadPath, filename);
//         const relativePath = `/uploads/${filename}`;  // This is the path that will be stored in DB

//         // Create a proper readable stream from the file buffer
//         const { Readable } = require('stream');
//         const bufferStream = new Readable();
//         bufferStream.push(file.buffer);
//         bufferStream.push(null); // Signals end of stream

//         await pump(
//             bufferStream,
//             createWriteStream(absolutePath)
//         );

//         return {
//             filename,
//             path: relativePath  // Return the relative path instead of absolute
//         };
//     }

//     async deleteFile(filename: string): Promise<void> {
//         const absolutePath = join(this.uploadPath, filename);
//         await remove(absolutePath).catch(err => {
//             if (err.code !== 'ENOENT') { // Ignore "file not found" errors
//                 throw err;
//             }
//         });
//     }

//     // Helper method to convert relative path back to absolute when needed
//     getAbsolutePath(relativePath: string): string {
//         if (relativePath.startsWith('/uploads/')) {
//             return join(this.uploadPath, relativePath.replace('/uploads/', ''));
//         }
//         return join(this.uploadPath, relativePath);
//     }
// }