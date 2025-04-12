import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { FontResponseDto } from './dto/font-response.dto';
import { FontGroupResponseDto } from './dto/font-group-response.dto';
import { FontsService } from './font.service';
import { FontGroupsService } from './font-groups.service';
import { CreateFontGroupDto } from './dto/create-font.dto';

@ApiTags('Font Management')
@Controller('fonts')
export class FontsController {
  constructor(
    private readonly fontsService: FontsService,
    private readonly fontGroupsService: FontGroupsService,
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(ttf)$/)) {
        return callback(new Error('Only TTF files are allowed'), false);
      }
      callback(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Font file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: FontResponseDto })
  async uploadFont(@UploadedFile() file: Express.Multer.File): Promise<FontResponseDto> {
    return this.fontsService.uploadFont(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all available fonts' })
  @ApiResponse({ status: 200, description: 'List of fonts', type: [FontResponseDto] })
  async getAllFonts(): Promise<FontResponseDto[]> {
    return this.fontsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a font' })
  @ApiParam({ name: 'id', description: 'Font ID' })
  @ApiResponse({ status: 200, description: 'Font deleted successfully', type: FontResponseDto })
  @ApiResponse({ status: 404, description: 'Font not found' })
  async deleteFont(@Param('id', ParseUUIDPipe) id: string): Promise<FontResponseDto> {
    return this.fontsService.delete(id);
  }

  @Post('groups')
  @ApiOperation({ summary: 'Create a new font group' })
  @ApiResponse({ status: 201, description: 'Font group created', type: FontGroupResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request (minimum 2 fonts required)' })
  async createFontGroup(@Body() dto: CreateFontGroupDto): Promise<FontGroupResponseDto> {
    return this.fontGroupsService.create(dto);
  }

  @Get('groups')
  @ApiOperation({ summary: 'Get all font groups' })
  @ApiResponse({ status: 200, description: 'List of font groups', type: [FontGroupResponseDto] })
  async getAllFontGroups(): Promise<FontGroupResponseDto[]> {
    return this.fontGroupsService.findAll();
  }

  @Delete('groups/:id')
  @ApiOperation({ summary: 'Delete a font group' })
  @ApiParam({ name: 'id', description: 'Font group ID' })
  @ApiResponse({ status: 200, description: 'Font group deleted', type: FontGroupResponseDto })
  @ApiResponse({ status: 404, description: 'Font group not found' })
  async deleteFontGroup(@Param('id', ParseUUIDPipe) id: string): Promise<FontGroupResponseDto> {
    return this.fontGroupsService.delete(id);
  }
}