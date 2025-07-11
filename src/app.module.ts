import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ItemsModule } from './items/items.module';
import { AuthService } from './auth/auth.service';
import { TokenInterceptor } from './token.interceptor';
import { HttpModule } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ItemsModule,
    SharedModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available in all modules
    })
  ],
  providers: [
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenInterceptor,
    },
  ],
})

export class AppModule {}
