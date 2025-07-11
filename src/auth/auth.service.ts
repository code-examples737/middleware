import { Injectable, Logger, } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService  {
  private token: string | null = null;
  private tokenExpiresAt: number = 0;
  private readonly logger = new Logger(AuthService.name);
  private readonly AUTH_URL = 'https://url/login/token';
  private readonly TOKEN_EXPIRY_BUFFER = 300000; // 5 minutes buffer

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async getToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.token!;
    }

    return this.refreshToken();
  }

  private isTokenValid(): boolean {
    return this.token !== null && Date.now() < this.tokenExpiresAt - this.TOKEN_EXPIRY_BUFFER;
  }

  public async initializeToken(): Promise<void> {
    try {
      await this.refreshToken();
    } catch (error) {
      this.logger.error('Initial token acquisition failed', error);
    }
  }

  private async refreshToken(): Promise<string> {
    try {
      this.logger.log('Attempting to fetch new token...');
      const username = this.configService.get<string>('USERNAME');
      const password = this.configService.get<string>('PASSWORD');
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const response = await firstValueFrom(
        this.httpService.post(this.AUTH_URL, {
          username,
          password
        }, { headers })
      );
      if (!response.data?.access_token) {
        throw new Error('Invalid token response structure');
      }

      this.token = response.data.access_token;
      // Default to 24 hours if no expiry is provided
      const expiresIn = response.data.expires_in || 86400; 
      this.tokenExpiresAt = Date.now() + expiresIn * 1000;

      this.logger.log(`Token acquired. Expires at: ${new Date(this.tokenExpiresAt).toISOString()}`);
      return this.token as string;
    } catch (error) {
      this.logger.error('Token refresh failed', this.formatError(error));
      throw new Error('Failed to acquire authentication token');
    }
  }

  private formatError(error: unknown): string {
    if (error instanceof AxiosError) {
      return `HTTP ${error.response?.status}: ${JSON.stringify(error.response?.data)}`;
    }
    return error instanceof Error ? error.message : String(error);
  }
}