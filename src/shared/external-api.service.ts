import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { UpdatePayload } from './types/external-api/global';
import { ApiServiceInterface } from './types/ApiServiceInterface';

@Injectable()
export class ExternalApiService implements ApiServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  async send(id: string, txt: string) {
    const url = 'https://url/';
    const payload = {
      id,
      txt,
      // Add other necessary properties here
    };
    try {
      const response = await firstValueFrom(this.httpService.post(url, payload));
      return response.data;
    } catch (error) {
      throw new Error('Failed to send data');
    }
  }

  async update(payload: UpdatePayload) {

    const url = `https://url/${payload.id}`;
    try {
      const response = await firstValueFrom(this.httpService.put(url, {
        //properties to update
      }));
      return response.data;
    } catch (error) {
      throw new Error('Failed to restrict unit');
    }
  }


  async delete(id: string) {
    const url = `https://url/${id}`;
    try {
      const response = await firstValueFrom(this.httpService.delete(url));
      return response.data;
    } catch (error) {
      console.error('Error', error?.response?.data || error.message);
      throw new Error('Failed to restrict unit');
    }
  }

  async getItems() {
    const url = 'https://url/items/';
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      console.error('Error', error?.response?.data || error.message);
      throw new Error('Failed to load items');
    }
  }

}
