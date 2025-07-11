import { Injectable } from '@nestjs/common';
import { ExternalApiService } from '../shared/external-api.service';
import { UpdatePayload } from 'src/shared/types/external-api/global';

@Injectable()
export class ItemsService {

  constructor(
    private readonly externalApiService: ExternalApiService
  ) {}

  async update(payload: UpdatePayload) {
    const result = await this.externalApiService.update(payload);
    return { status: true, msg: 'Item updated', result };
  }

  async getItems() {
    const result = await this.externalApiService.getItems();
    return { status: true, msg: 'Items fetched', items: result };
  }
}
