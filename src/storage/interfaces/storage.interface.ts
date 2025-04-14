export interface StorageService {
    saveFile(file: Express.Multer.File): Promise<{ filename: string; path: string }>;
    deleteFile(filename: string): Promise<void>;
    uploadPath: string;
}