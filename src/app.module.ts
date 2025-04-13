import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { FontsModule } from './modules/font/font.module';
import { FontGroupsModule } from './modules/font-groups/font-groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const uploadPath = config.get<string>('storage.destination', './uploads');
        return [{
          rootPath: join(__dirname, '..', uploadPath),
          serveRoot: '/fonts',
        }];
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    FontsModule,
    StorageModule,
    FontGroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
