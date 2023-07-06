import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'mad',
      password: '1234',
      database: 'madground',
      synchronize: true,
      logging: false,
      entities: ['src/**/**.entity{.ts,.js}'],
      migrations: ['src/migrations/**/*{.ts,.js}'],
      subscribers: ['src/subscriber/**/*{.ts,.js}'],
    }),
    UserModule,
    SwaggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
