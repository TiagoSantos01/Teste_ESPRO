import { NestFactory,Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel, ClassSerializerInterceptor, ValidationError } from '@nestjs/common';
import * as fs from 'node:fs';
import { I18nValidationPipe } from 'nestjs-i18n/dist/pipes/i18n-validation.pipe';
import { I18nValidationExceptionFilter } from 'nestjs-i18n/dist/filters/i18n-validation-exception.filter';
import * as bodyParser from 'body-parser';
import { Request, Response as ExpressResponse, NextFunction } from 'express';

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

  app.useGlobalPipes(new I18nValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true
  }));

  app.useGlobalFilters(new I18nValidationExceptionFilter({
    errorFormatter: (errors: ValidationError[]) => {
      const messages: Record<string, string> = {};
      errors.forEach(err => {
        if (err.constraints) {
          const firstConstraintKey = Object.keys(err.constraints)[0];
          messages[err.property] = err.constraints[firstConstraintKey];
        }
      });
      return messages;
    }
  })
  );

  app.enableCors({
    origin: [...(process.env.CORS_URLS?.split(',') || [])],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'api-key-pub','api-key'],
  });
  
  app.use(bodyParser.json({ limit: '10mb' }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use((req: Request, res: ExpressResponse, next: NextFunction): void => {
    const start = Date.now();
    const ip =
      Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
          .toString()
          .replace('::ffff:', '');

    res.on('finish', () => {
      const latency = Date.now() - start;
      const logData: Record<string, any> = {
        statusCode: res.statusCode,
        method: req.method,
        url: req.originalUrl,
        latency: `${latency}ms`,
        clientIp: ip,
      };

      if (process.env.DEBUG === 'ACTIVE') {
        logData.payload = req.body;
      }

      logger.log(JSON.stringify(logData));
    });
    next();
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port}`);
}
bootstrap();
