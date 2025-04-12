import { ApiProperty } from '@nestjs/swagger';
import { Font } from '../entities/font.entity';

export class FontResponseDto extends Font { }