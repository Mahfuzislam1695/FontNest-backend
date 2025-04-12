import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateFontGroupDto {
    @ApiProperty({ example: 'Sans-serif Collection' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: ['a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'],
        minItems: 2
    })
    @IsArray()
    @IsUUID(4, { each: true })
    @MinLength(2)
    fonts: string[];
}