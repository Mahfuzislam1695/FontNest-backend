import { Module } from '@nestjs/common';
import { FontGroupsService } from './font-groups.service';
import { FontGroupsController } from './font-groups.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IsValidFontArray } from './validators/font-array.validator';

@Module({
  imports: [PrismaModule], // Add this line
  controllers: [FontGroupsController],
  providers: [FontGroupsService, IsValidFontArray],
})
export class FontGroupsModule { }
