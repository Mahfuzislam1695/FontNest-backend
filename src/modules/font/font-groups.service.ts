
import { BadRequestException, Injectable } from '@nestjs/common';
import { FontGroupsRepository } from './font-groups.repository';
import { FontGroupResponseDto } from './dto/font-group-response.dto';
import { CreateFontGroupDto } from './dto/create-font.dto';

@Injectable()
export class FontGroupsService {
    constructor(private readonly repository: FontGroupsRepository) { }

    async create(dto: CreateFontGroupDto): Promise<FontGroupResponseDto> {
        if (dto.fonts.length < 2) {
            throw new BadRequestException('At least two fonts are required to create a group');
        }

        // Check for duplicate fonts
        const uniqueFonts = new Set(dto.fonts);
        if (uniqueFonts.size !== dto.fonts.length) {
            throw new BadRequestException('Duplicate fonts are not allowed in a group');
        }

        return this.repository.create(dto);
    }

    async findAll(): Promise<FontGroupResponseDto[]> {
        return this.repository.findAll();
    }

    async delete(id: string): Promise<FontGroupResponseDto> {
        return this.repository.delete(id);
    }
}