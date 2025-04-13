// src/font-groups/font-groups.module.ts
import { Module } from '@nestjs/common';
import { FontGroupsService } from './font-groups.service';
import { FontGroupsController } from './font-groups.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FontGroupsController],
  providers: [FontGroupsService],
  exports: [FontGroupsService]
})
export class FontGroupsModule { }
