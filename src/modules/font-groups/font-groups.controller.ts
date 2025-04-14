import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UsePipes,
  ParseUUIDPipe,
  HttpStatus,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { FontGroupsService } from './font-groups.service';
import { CreateFontGroupDto } from './dto/create-font-group.dto';
import { UpdateFontGroupDto } from './dto/update-font-group.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { sendResponse } from 'src/common/responses/send-response';


@ApiTags('Font Groups')
@Controller('font-groups')
export class FontGroupsController {
  constructor(private readonly fontGroupsService: FontGroupsService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new font group' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Font group created successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or group already exists'
  })
  async create(
    @Body() createFontGroupDto: CreateFontGroupDto,
    @Res() res: Response
  ) {
    const group = await this.fontGroupsService.create(createFontGroupDto);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Font group created successfully!',
      data: group
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all font groups' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all font groups'
  })
  async findAll(@Res() res: Response) {
    const groups = await this.fontGroupsService.findAll();
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Font groups retrieved successfully!',
      data: groups
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a font group by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Font group details'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Font group not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response
  ) {
    const group = await this.fontGroupsService.findOne(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Font group retrieved successfully!',
      data: group
    });
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a font group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Font group updated'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Font group not found'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFontGroupDto: UpdateFontGroupDto,
    @Res() res: Response
  ) {
    const group = await this.fontGroupsService.update(id, updateFontGroupDto);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Font group updated successfully!',
      data: group
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a font group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Font group deleted'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Font group not found'
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response
  ) {
    const group = await this.fontGroupsService.remove(id);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Font group deleted successfully!',
      data: group
    });
  }
}
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Patch,
//   Delete,
//   UsePipes,
//   ParseUUIDPipe
// } from '@nestjs/common';
// import { FontGroupsService } from './font-groups.service';
// import { CreateFontGroupDto } from './dto/create-font-group.dto';
// import { UpdateFontGroupDto } from './dto/update-font-group.dto';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { ValidationPipe } from 'src/common/pipes/validation.pipe';

// @ApiTags('Font Groups')
// @Controller('font-groups')
// export class FontGroupsController {
//   constructor(private readonly fontGroupsService: FontGroupsService) { }

//   @Post()
//   @UsePipes(new ValidationPipe())
//   @ApiOperation({ summary: 'Create a new font group' })
//   @ApiResponse({
//     status: 201,
//     description: 'Font group created successfully'
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Validation failed'
//   })
//   create(@Body() createFontGroupDto: CreateFontGroupDto) {
//     return this.fontGroupsService.create(createFontGroupDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all font groups' })
//   @ApiResponse({
//     status: 200,
//     description: 'List of all font groups'
//   })
//   findAll() {
//     return this.fontGroupsService.findAll();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get a font group by ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Font group details'
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Font group not found'
//   })
//   findOne(@Param('id', ParseUUIDPipe) id: string) {
//     return this.fontGroupsService.findOne(id);
//   }

//   @Patch(':id')
//   @UsePipes(new ValidationPipe())
//   @ApiOperation({ summary: 'Update a font group' })
//   @ApiResponse({
//     status: 200,
//     description: 'Font group updated'
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Validation failed'
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Font group not found'
//   })
//   update(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() updateFontGroupDto: UpdateFontGroupDto
//   ) {
//     return this.fontGroupsService.update(id, updateFontGroupDto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a font group' })
//   @ApiResponse({
//     status: 200,
//     description: 'Font group deleted'
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Font group not found'
//   })
//   remove(@Param('id', ParseUUIDPipe) id: string) {
//     return this.fontGroupsService.remove(id);
//   }
// }