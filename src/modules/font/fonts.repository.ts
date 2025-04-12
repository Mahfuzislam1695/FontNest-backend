import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Font } from './entities/font.entity';

@Injectable()
export class FontsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: { name: string; filename: string; path: string }): Promise<Font> {
        return this.prisma.font.create({
            data: {
                name: data.name,
                filename: data.filename,
                path: data.path,
            },
        });
    }

    async findAll(): Promise<Font[]> {
        return this.prisma.font.findMany();
    }

    async delete(id: string): Promise<Font> {
        // Delete all font group associations first
        await this.prisma.fontGroupFont.deleteMany({
            where: { fontId: id },
        });

        return this.prisma.font.delete({
            where: { id },
        });
    }
}