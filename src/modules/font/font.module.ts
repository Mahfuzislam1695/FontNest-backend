import { Module } from '@nestjs/common';
import { FontsRepository } from './fonts.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FontsController } from './font.controller';
import { StorageModule } from 'src/storage/storage.module';
import { FontsService } from './font.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [FontsController],
  providers: [
    FontsService,
    FontsRepository
  ],
})
export class FontsModule { }
