import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FontGroupResponseDto } from './dto/font-group-response.dto';

@Injectable()
export class FontGroupsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: { title: string; fonts: string[] }): Promise<FontGroupResponseDto> {
        const group = await this.prisma.fontGroup.create({
            data: {
                title: data.title,
                fonts: {
                    create: data.fonts.map(fontId => ({
                        font: { connect: { id: fontId } }
                    })),
                },
            },
            include: {
                fonts: {
                    include: {
                        font: true,
                    },
                },
            },
        });

        return this.mapToDto(group);
    }

    async findAll(): Promise<FontGroupResponseDto[]> {
        const groups = await this.prisma.fontGroup.findMany({
            include: {
                fonts: {
                    include: {
                        font: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return groups.map(this.mapToDto);
    }

    async delete(id: string): Promise<FontGroupResponseDto> {
        const group = await this.prisma.fontGroup.findUnique({
            where: { id },
            include: {
                fonts: {
                    include: {
                        font: true,
                    },
                },
            },
        });

        if (!group) {
            return null;
        }

        await this.prisma.fontGroupFont.deleteMany({
            where: { groupId: id },
        });

        await this.prisma.fontGroup.delete({
            where: { id },
        });

        return this.mapToDto(group);
    }

    private mapToDto(group: any): FontGroupResponseDto {
        return {
            id: group.id,
            title: group.title,
            fonts: group.fonts.map(fg => fg.font),
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        };
    }
}