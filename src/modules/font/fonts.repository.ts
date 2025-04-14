import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Font } from './entities/font.entity';

@Injectable()
export class FontsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByName(name: string): Promise<Font | null> {
        return this.prisma.font.findFirst({
            where: { name },
        });
    }

    async create(data: Prisma.FontCreateInput): Promise<Font> {
        try {
            return await this.prisma.font.create({
                data: {
                    name: data.name,
                    filename: data.filename,
                    path: data.path,
                    size: data.size,
                    mimetype: data.mimetype,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') { // Unique constraint violation
                    throw new Error(`Font with filename '${data.filename}' already exists`);
                }
            }
            throw error;
        }
    }

    async findAll(): Promise<Font[]> {
        return this.prisma.font.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id: string): Promise<Font | null> {
        return this.prisma.font.findUnique({
            where: { id },
        });
    }

    async findByFilename(filename: string): Promise<Font | null> {
        return this.prisma.font.findFirst({
            where: { filename },
        });
    }

    async delete(id: string): Promise<Font> {
        try {
            // Check if font exists first
            const font = await this.prisma.font.findUnique({
                where: { id },
            });

            if (!font) {
                throw new NotFoundException(`Font with ID ${id} not found`);
            }

            // Delete all font group associations first
            await this.prisma.fontGroupFont.deleteMany({
                where: { fontId: id },
            });

            return await this.prisma.font.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') { // Record not found
                    throw new NotFoundException(`Font with ID ${id} not found`);
                }
            }
            throw error;
        }
    }

    async count(): Promise<number> {
        return this.prisma.font.count();
    }

    async searchByName(name: string): Promise<Font[]> {
        return this.prisma.font.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
}