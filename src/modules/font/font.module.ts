import { Module } from '@nestjs/common';
import { FontGroupsService } from './font-groups.service';
import { FontsRepository } from './fonts.repository';
import { FontGroupsRepository } from './font-groups.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FontsController } from './font.controller';
import { StorageModule } from 'src/storage/storage.module';
import { FontsService } from './font.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [FontsController],
  providers: [
    FontsService,
    FontGroupsService,
    FontsRepository,
    FontGroupsRepository
  ],
})
export class FontsModule { }
