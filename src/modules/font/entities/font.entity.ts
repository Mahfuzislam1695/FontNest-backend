import { ApiProperty } from '@nestjs/swagger';

export class Font {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        description: 'Unique identifier for the font'
    })
    id: string;

    @ApiProperty({
        example: 'Roboto',
        maxLength: 100,
        description: 'Name of the font (must be unique)'
    })
    name: string;

    @ApiProperty({
        example: 'roboto-123456789.ttf',
        maxLength: 255,
        description: 'Unique filename with timestamp to prevent conflicts'
    })
    filename: string;

    @ApiProperty({
        example: '/uploads/roboto-123456789.ttf',
        description: 'Relative path to the font file from the uploads directory',
        maxLength: 500
    })
    path: string;

    @ApiProperty({
        example: 'http://api.example.com/uploads/roboto-123456789.ttf',
        description: 'Full public URL to access the font file',
        required: false
    })
    url?: string;  // Made optional

    @ApiProperty({
        example: 102400,
        description: 'Size of the font file in bytes',
        minimum: 0
    })
    size: number;

    @ApiProperty({
        example: 'font/ttf',
        description: 'MIME type of the font file',
        enum: ['font/ttf', 'font/otf', 'application/x-font-ttf', 'application/x-font-otf']
    })
    mimetype: string;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Timestamp when the font was uploaded',
        format: 'date-time'
    })
    createdAt: Date;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Timestamp when the font was last updated',
        format: 'date-time'
    })
    updatedAt: Date;

    @ApiProperty({
        example: ['Sans-serif Collection', 'Modern Fonts'],
        description: 'Array of font group names this font belongs to',
        type: [String],
        required: false
    })
    groups?: string[];

    @ApiProperty({
        example: false,
        description: 'Indicates if this font replaced an existing one',
        required: false
    })
    wasReplaced?: boolean;
}
