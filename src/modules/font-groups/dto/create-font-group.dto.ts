
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID, MinLength, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFontGroupDto {
    @ApiProperty({
        description: 'Unique title for the font group',
        example: 'Sans-serif Collection'
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: ['d31a0917-2ff0-440e-adb0-61ff8f3cf0f7', '5177132c-dc37-42d3-a188-9a6aa231dcf8'],
        description: 'Array of font UUIDs'
    })
    @IsArray()
    // @MinLength(2, { message: 'You must select at least 2 fonts' })
    @IsUUID(4, { each: true, message: 'Each font must be a valid UUID' })
    @Transform(({ value }) => Array.isArray(value) ? [...new Set(value)] : value) // Remove duplicates
    fonts: string[];
}