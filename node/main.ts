import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel, ClassSerializerInterceptor, ValidationError } from '@nestjs/common';
import * as fs from 'node:fs';

const logger = new Logger('HTTPS');

async function bootstrap() {
  const httpsKeyPath = process.env.HTTPS_KEY_PATH;
  const httpsCertPath = process.env.HTTPS_CERT_PATH;

  const httpsOptions =  httpsKeyPath && httpsCertPath && fs.existsSync(httpsKeyPath) && fs.existsSync(httpsCertPath)
    ? {
      key: fs.readFileSync(httpsKeyPath),
      cert: fs.readFileSync(httpsCertPath),
    }
    : undefined;

  const app = await NestFactory.create(AppModule, {
    logger: (process.env.LOGLEVEL as LogLevel)?.split(',') as LogLevel[] || ['warn', 'error'],
    httpsOptions,
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port}`);
}
bootstrap();
