import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateFontGroupDto {
    @ApiProperty({ example: 'Sans-serif Collection' })
    @IsString()
    @IsNotEmpty({ message: 'Title should not be empty' })
    title: string;

    @ApiProperty({
        example: ['a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', 'd31a0917-2ff0-440e-adb0-61ff8f3cf0f7'],
        description: 'Array of font UUIDs'
    })
    @IsArray()
    @MinLength(2, { message: 'You must select at least 2 fonts' })
    @IsUUID(4, { each: true, message: 'Each font must be a valid UUID' })
    fonts: string[];
}