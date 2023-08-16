import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import { MyConfigType } from './common/config/myconfig.type';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<MyConfigType> = app.get(ConfigService);
  
  app.use(cookieParser());
  
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  
  await app.listen(configService.get('PORT'));
}
bootstrap();
