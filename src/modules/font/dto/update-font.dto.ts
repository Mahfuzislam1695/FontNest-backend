import { PartialType } from '@nestjs/mapped-types';
import { CreateFontGroupDto } from './create-font.dto';


export class UpdateFontDto extends PartialType(CreateFontGroupDto) { }
