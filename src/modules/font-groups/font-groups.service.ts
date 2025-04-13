import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateFontGroupDto } from './dto/create-font-group.dto';
import { UpdateFontGroupDto } from './dto/update-font-group.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FontGroupsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createFontGroupDto: CreateFontGroupDto) {
    // Additional database validation
    const existingFonts = await this.prisma.font.findMany({
      where: { id: { in: createFontGroupDto.fonts } }
    });

    if (existingFonts.length !== createFontGroupDto.fonts.length) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: [{
          property: 'fonts',
          constraints: { 'fontExists': 'One or more fonts do not exist' }
        }]
      });
    }

    return this.prisma.fontGroup.create({
      data: {
        title: createFontGroupDto.title,
        fonts: {
          create: createFontGroupDto.fonts.map(fontId => ({
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
  }

  async findAll() {
    return this.prisma.fontGroup.findMany({
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
  }

  async findOne(id: string) {
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
      throw new NotFoundException('Font group not found');
    }

    return group;
  }

  async update(id: string, updateFontGroupDto: UpdateFontGroupDto) {
    await this.findOne(id); // Check if group exists

    if (updateFontGroupDto.fonts && updateFontGroupDto.fonts.length < 2) {
      throw new BadRequestException('At least two fonts are required in a group');
    }

    // Delete existing font relations
    await this.prisma.fontGroupFont.deleteMany({
      where: { groupId: id },
    });

    return this.prisma.fontGroup.update({
      where: { id },
      data: {
        title: updateFontGroupDto.title,
        fonts: {
          create: updateFontGroupDto.fonts?.map(fontId => ({
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
  }

  async remove(id: string) {
    await this.findOne(id); // Check if group exists

    // Delete all font relations first
    await this.prisma.fontGroupFont.deleteMany({
      where: { groupId: id },
    });

    return this.prisma.fontGroup.delete({
      where: { id },
    });
  }
}