import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
  BadRequestException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { FontResponseDto } from './dto/font-response.dto';
import { FontsService } from './font.service';
import { sendResponse } from 'src/common/responses/send-response';
import { Response } from 'express';

@ApiTags('Font Management')
@Controller('fonts')
export class FontsController {
  constructor(private readonly fontsService: FontsService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (req, file, callback) => {
      if (!file?.originalname?.match(/\.(ttf|otf)$/i)) {
        return callback(new BadRequestException('Only .ttf and .otf files are allowed'), false);
      }
      callback(null, true);
    }
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Font file (TTF/OTF format, max 5MB)',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Font uploaded successfully',
    type: FontResponseDto
  })
  @ApiResponse({
    status: 200,
    description: 'Font replaced successfully',
    type: FontResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid file type (only TTF/OTF allowed) or size exceeded (max 5MB)'
  })
  @ApiConflictResponse({
    description: 'Font with this name already exists and could not be replaced'
  })
  async uploadFont(
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ statusCode: number; message: string; data: FontResponseDto }> {
    if (!file) {
      throw new BadRequestException('No file uploaded or file is empty');
    }

    const font = await this.fontsService.uploadFont(file);
    const wasReplaced = await this.fontsService.wasFontReplaced(file);

    return {
      statusCode: wasReplaced ? 200 : 201,
      message: wasReplaced ? 'Font replaced successfully' : 'Font uploaded successfully',
      data: font
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all available fonts',
    description: 'Returns a list of all uploaded fonts'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of fonts retrieved successfully',
    type: [FontResponseDto]
  })
  async getAllFonts(@Res() res: Response) {
    const fonts = await this.fontsService.findAll();

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Fonts retrieved successfully!',
      data: fonts,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a font',
    description: 'Deletes a font by its UUID'
  })
  @ApiParam({
    name: 'id',
    description: 'Font ID (UUID format)',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Font deleted successfully',
    type: FontResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Font not found',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Font not found',
        error: 'Not Found'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format or deletion failed',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid UUID format',
        error: 'Bad Request'
      }
    }
  })
  async deleteFont(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response
  ) {
    const deletedFont = await this.fontsService.delete(id);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Font deleted successfully!',
      data: deletedFont,
    });
  }
}
// import {
//   Controller,
//   Post,
//   Get,
//   Delete,
//   UploadedFile,
//   UseInterceptors,
//   Param,
//   ParseUUIDPipe,
//   BadRequestException,
//   HttpStatus,
//   Res,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiConsumes,
//   ApiBody,
//   ApiParam,
//   ApiBadRequestResponse,
//   ApiNotFoundResponse,
//   ApiConflictResponse,
// } from '@nestjs/swagger';
// import { FontResponseDto } from './dto/font-response.dto';
// import { FontsService } from './font.service';
// import { sendResponse } from 'src/common/responses/send-response';
// import { Response } from 'express';

// @ApiTags('Font Management')
// @Controller('fonts')
// export class FontsController {
//   constructor(private readonly fontsService: FontsService) { }

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file', {
//     limits: {
//       fileSize: 1024 * 1024 * 5, // 5MB
//     },
//     fileFilter: (req, file, callback) => {
//       if (!file?.originalname?.match(/\.(ttf|otf)$/i)) {
//         return callback(new BadRequestException('Only .ttf and .otf files are allowed'), false);
//       }
//       callback(null, true);
//     }
//   }))
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: 'Font file (TTF/OTF format, max 5MB)',
//     schema: {
//       type: 'object',
//       required: ['file'],
//       properties: {
//         file: {
//           type: 'string',
//           format: 'binary',
//         },
//       },
//     },
//   })
//   @ApiResponse({
//     status: 201,
//     description: 'Font uploaded successfully',
//     type: FontResponseDto
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Font replaced successfully',
//     type: FontResponseDto
//   })
//   @ApiBadRequestResponse({
//     description: 'Invalid file type (only TTF/OTF allowed) or size exceeded (max 5MB)'
//   })
//   @ApiConflictResponse({
//     description: 'Font with this name already exists and could not be replaced'
//   })
//   async uploadFont(
//     @UploadedFile() file: Express.Multer.File
//   ): Promise<{ statusCode: number; message: string; data: FontResponseDto }> {
//     if (!file) {
//       throw new BadRequestException('No file uploaded or file is empty');
//     }

//     const font = await this.fontsService.uploadFont(file);
//     const wasReplaced = await this.fontsService.wasFontReplaced(file);

//     return {
//       statusCode: wasReplaced ? 200 : 201,
//       message: wasReplaced ? 'Font replaced successfully' : 'Font uploaded successfully',
//       data: font
//     };
//   }

//   @Get()
//   @ApiOperation({
//     summary: 'Get all available fonts',
//     description: 'Returns a list of all uploaded fonts'
//   })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'List of fonts retrieved successfully',
//     type: [FontResponseDto]
//   })
//   async getAllFonts(@Res() res: Response) {
//     const fonts = await this.fontsService.findAll();

//     sendResponse(res, {
//       statusCode: HttpStatus.OK,
//       success: true,
//       message: 'Fonts retrieved successfully!',
//       data: fonts,
//     });
//   }

//   @Delete(':id')
//   @ApiOperation({
//     summary: 'Delete a font',
//     description: 'Deletes a font by its UUID'
//   })
//   @ApiParam({
//     name: 'id',
//     description: 'Font ID (UUID format)',
//     example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
//   })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'Font deleted successfully',
//     type: FontResponseDto
//   })
//   @ApiNotFoundResponse({
//     description: 'Font not found',
//     schema: {
//       example: {
//         statusCode: HttpStatus.NOT_FOUND,
//         message: 'Font not found',
//         error: 'Not Found'
//       }
//     }
//   })
//   @ApiBadRequestResponse({
//     description: 'Invalid UUID format or deletion failed',
//     schema: {
//       example: {
//         statusCode: HttpStatus.BAD_REQUEST,
//         message: 'Invalid UUID format',
//         error: 'Bad Request'
//       }
//     }
//   })
//   async deleteFont(
//     @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
//     @Res() res: Response
//   ) {
//     const deletedFont = await this.fontsService.delete(id);

//     sendResponse(res, {
//       statusCode: HttpStatus.OK,
//       success: true,
//       message: 'Font deleted successfully!',
//       data: deletedFont,
//     });
//   }
// }