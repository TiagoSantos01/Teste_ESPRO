import { Module } from '@nestjs/common';
import { AppController } from './src/application/controller/app.controller';
import { AppService } from './src/domain/services/app.service';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AcceptLanguageResolver,
  I18nModule,
} from 'nestjs-i18n';
import { FlatJsonI18nLoader } from '@infrastructure/i18n/flat-json.loader';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'pt',
      loader: FlatJsonI18nLoader,
      loaderOptions: {
        path: (() => {
          const devPath = path.join(process.cwd(), 'src', 'i18n');
          const distPath = path.join(process.cwd(), 'dist', 'src', 'i18n');
          const prodPath = path.join(__dirname, '..', 'i18n');
          if (fs.existsSync(devPath)) return devPath;
          if (fs.existsSync(distPath)) return distPath;
          if (fs.existsSync(prodPath)) return prodPath;
          return devPath;
        })(),
        watch: process.env.I18N_WATCH === 'true',
      },
      resolvers: [AcceptLanguageResolver],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
