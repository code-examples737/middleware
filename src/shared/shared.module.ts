import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiService } from './external-api.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [ExternalApiService],
  exports: [ExternalApiService],
})
export class SharedModule {}
