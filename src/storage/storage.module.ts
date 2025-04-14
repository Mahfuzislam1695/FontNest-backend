import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocalStorageService } from './storage.service';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'StorageService',
            useClass: LocalStorageService,
        },
    ],
    exports: ['StorageService'],
})
export class StorageModule { }