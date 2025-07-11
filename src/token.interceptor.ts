import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';

@Injectable()
export class TokenInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService
  ) {
    // Add interceptor to axios instance
    this.httpService.axiosRef.interceptors.request.use(async (config) => {
      if (config.url && this.requiresToken(config.url)) {
        const token = await this.authService.getToken();
        //set the token in the headers
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  private requiresToken(url: string): boolean {
    //TODO add more specific conditions if need
    return !url.includes('/login/');
  }
}