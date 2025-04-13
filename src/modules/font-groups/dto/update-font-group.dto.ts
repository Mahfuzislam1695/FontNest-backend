import { PartialType } from '@nestjs/swagger';
import { CreateFontGroupDto } from './create-font-group.dto';

export class UpdateFontGroupDto extends PartialType(CreateFontGroupDto) { }
