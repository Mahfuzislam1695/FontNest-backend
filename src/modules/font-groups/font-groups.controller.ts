import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FontGroupsService } from './font-groups.service';
import { CreateFontGroupDto } from './dto/create-font-group.dto';
import { UpdateFontGroupDto } from './dto/update-font-group.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Font Groups')
@Controller('font-groups')
export class FontGroupsController {
  constructor(private readonly fontGroupsService: FontGroupsService) { }

  @Post()
  @UsePipes(new ValidationPipe()) // Apply validation pipe
  async create(@Body() createFontGroupDto: CreateFontGroupDto) {
    return this.fontGroupsService.create(createFontGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all font groups' })
  @ApiResponse({ status: 200, description: 'List of all font groups' })
  findAll() {
    return this.fontGroupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a font group by ID' })
  @ApiParam({ name: 'id', description: 'Font group ID' })
  @ApiResponse({ status: 200, description: 'Font group details' })
  @ApiResponse({ status: 404, description: 'Font group not found' })
  findOne(@Param('id') id: string) {
    return this.fontGroupsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a font group' })
  @ApiParam({ name: 'id', description: 'Font group ID' })
  @ApiResponse({ status: 200, description: 'Font group updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Font group not found' })
  update(@Param('id') id: string, @Body() updateFontGroupDto: UpdateFontGroupDto) {
    return this.fontGroupsService.update(id, updateFontGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a font group' })
  @ApiParam({ name: 'id', description: 'Font group ID' })
  @ApiResponse({ status: 200, description: 'Font group deleted' })
  @ApiResponse({ status: 404, description: 'Font group not found' })
  remove(@Param('id') id: string) {
    return this.fontGroupsService.remove(id);
  }
}
