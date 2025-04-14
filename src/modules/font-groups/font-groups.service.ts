import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFontGroupDto } from './dto/create-font-group.dto';
import { UpdateFontGroupDto } from './dto/update-font-group.dto';

@Injectable()
export class FontGroupsService {
  constructor(private readonly prisma: PrismaService) { }

  private formatFontGroup(group: any) {
    return {
      ...group,
      fonts: group.fonts?.map(fg => ({
        ...fg.font,
        // Add any font formatting here if needed
      })) || []
    };
  }

  async create(createFontGroupDto: CreateFontGroupDto) {
    // Check for existing group with same title (case insensitive)
    const existingGroup = await this.prisma.fontGroup.findFirst({
      where: {
        title: {
          equals: createFontGroupDto.title,
          mode: 'insensitive'
        }
      }
    });

    if (existingGroup) {
      throw new BadRequestException('Font group with this title already exists');
    }

    // Service-level validation for minimum fonts
    if (createFontGroupDto.fonts.length < 2) {
      throw new BadRequestException('You must select at least 2 fonts');
    }

    // Verify all fonts exist
    const existingFonts = await this.prisma.font.findMany({
      where: { id: { in: createFontGroupDto.fonts } }
    });

    if (existingFonts.length !== createFontGroupDto.fonts.length) {
      throw new BadRequestException('One or more fonts do not exist');
    }

    const group = await this.prisma.fontGroup.create({
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

    return this.formatFontGroup(group);
  }

  async findAll() {
    const groups = await this.prisma.fontGroup.findMany({
      include: { fonts: { include: { font: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return groups.map(group => this.formatFontGroup(group));
  }

  async findOne(id: string) {
    const group = await this.prisma.fontGroup.findUnique({
      where: { id },
      include: { fonts: { include: { font: true } } }
    });

    if (!group) {
      throw new NotFoundException('Font group not found');
    }

    return this.formatFontGroup(group);
  }

  async update(id: string, updateFontGroupDto: UpdateFontGroupDto) {
    await this.findOne(id); // Check if exists

    if (updateFontGroupDto.fonts) {
      // Verify all fonts exist
      const existingFonts = await this.prisma.font.findMany({
        where: { id: { in: updateFontGroupDto.fonts } }
      });

      if (existingFonts.length !== updateFontGroupDto.fonts.length) {
        throw new BadRequestException('One or more fonts do not exist');
      }

      // Delete existing relations
      await this.prisma.fontGroupFont.deleteMany({ where: { groupId: id } });
    }

    const group = await this.prisma.fontGroup.update({
      where: { id },
      data: {
        title: updateFontGroupDto.title,
        ...(updateFontGroupDto.fonts && {
          fonts: {
            create: updateFontGroupDto.fonts.map(fontId => ({
              font: { connect: { id: fontId } }
            }))
          }
        })
      },
      include: { fonts: { include: { font: true } } }
    });

    return this.formatFontGroup(group);
  }

  async remove(id: string) {
    const group = await this.findOne(id); // Check if exists and get data

    // Delete relations first
    await this.prisma.fontGroupFont.deleteMany({ where: { groupId: id } });

    await this.prisma.fontGroup.delete({ where: { id } });

    return this.formatFontGroup(group); // Return the deleted group data
  }
}
// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateFontGroupDto } from './dto/create-font-group.dto';
// import { UpdateFontGroupDto } from './dto/update-font-group.dto';

// @Injectable()
// export class FontGroupsService {
//   constructor(private readonly prisma: PrismaService) { }

//   async create(createFontGroupDto: CreateFontGroupDto) {
//     // Check for existing group with same title (case insensitive)
//     const existingGroup = await this.prisma.fontGroup.findFirst({
//       where: {
//         title: {
//           equals: createFontGroupDto.title,
//           mode: 'insensitive' // Case insensitive comparison
//         }
//       }
//     });

//     if (existingGroup) {
//       throw new BadRequestException({
//         message: ['Font group with this title already exists'],
//         error: 'Bad Request',
//         statusCode: 400
//       });
//     }

//     // Service-level validation for minimum fonts
//     if (createFontGroupDto.fonts.length < 2) {
//       throw new BadRequestException({
//         message: ['You must select at least 2 fonts'],
//         error: 'Bad Request',
//         statusCode: 400
//       });
//     }

//     // Verify all fonts exist
//     const existingFonts = await this.prisma.font.findMany({
//       where: { id: { in: createFontGroupDto.fonts } }
//     });

//     if (existingFonts.length !== createFontGroupDto.fonts.length) {
//       throw new BadRequestException({
//         message: ['One or more fonts do not exist'],
//         error: 'Bad Request',
//         statusCode: 400
//       });
//     }

//     return this.prisma.fontGroup.create({
//       data: {
//         title: createFontGroupDto.title,
//         fonts: {
//           create: createFontGroupDto.fonts.map(fontId => ({
//             font: { connect: { id: fontId } }
//           })),
//         },
//       },
//       include: {
//         fonts: {
//           include: {
//             font: true,
//           },
//         },
//       },
//     });
//   }
//   async findAll() {
//     return this.prisma.fontGroup.findMany({
//       include: { fonts: { include: { font: true } } },
//       orderBy: { createdAt: 'desc' }
//     });
//   }

//   async findOne(id: string) {
//     const group = await this.prisma.fontGroup.findUnique({
//       where: { id },
//       include: { fonts: { include: { font: true } } }
//     });

//     if (!group) {
//       throw new NotFoundException({
//         message: ['Font group not found'],
//         error: 'Not Found',
//         statusCode: 404
//       });
//     }

//     return group;
//   }

//   async update(id: string, updateFontGroupDto: UpdateFontGroupDto) {
//     await this.findOne(id); // Check if exists

//     if (updateFontGroupDto.fonts) {
//       // Verify all fonts exist
//       const existingFonts = await this.prisma.font.findMany({
//         where: { id: { in: updateFontGroupDto.fonts } }
//       });

//       if (existingFonts.length !== updateFontGroupDto.fonts.length) {
//         throw new BadRequestException({
//           message: ['One or more fonts do not exist'],
//           error: 'Bad Request',
//           statusCode: 400
//         });
//       }

//       // Delete existing relations
//       await this.prisma.fontGroupFont.deleteMany({ where: { groupId: id } });
//     }

//     return this.prisma.fontGroup.update({
//       where: { id },
//       data: {
//         title: updateFontGroupDto.title,
//         ...(updateFontGroupDto.fonts && {
//           fonts: {
//             create: updateFontGroupDto.fonts.map(fontId => ({
//               font: { connect: { id: fontId } }
//             }))
//           }
//         })
//       },
//       include: { fonts: { include: { font: true } } }
//     });
//   }

//   async remove(id: string) {
//     await this.findOne(id); // Check if exists

//     // Delete relations first
//     await this.prisma.fontGroupFont.deleteMany({ where: { groupId: id } });

//     return this.prisma.fontGroup.delete({ where: { id } });
//   }
// }