import { Module, } from '@nestjs/common';
import { HttpModule, } from '@nestjs/axios';
import { ConfigModule, } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
  ],
  providers: [AuthService]
})
export class AuthModule {
  constructor(private readonly authService: AuthService) {}
  async onModuleInit() {
    await this.authService.initializeToken();
  }
}