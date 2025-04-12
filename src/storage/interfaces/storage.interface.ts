import { Multer } from 'multer';

export interface StorageService {
    saveFile(file: Express.Multer.File): Promise<string>;
    deleteFile(filename: string): Promise<void>;
    uploadPath: string;  // Add this line
}