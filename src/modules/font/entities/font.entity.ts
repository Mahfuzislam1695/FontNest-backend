import { ApiProperty } from '@nestjs/swagger';

export class Font {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
    id: string;

    @ApiProperty({ example: 'Roboto' })
    name: string;

    @ApiProperty({ example: 'roboto.ttf' })
    filename: string;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    updatedAt: Date;
}