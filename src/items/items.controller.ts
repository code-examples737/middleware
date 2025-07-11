import { Controller, Put, Get, Param, Body } from '@nestjs/common';
import { ItemsService } from './items.service';
import { UpdatePayload } from 'src/shared/types/external-api/global';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Put(':id/update')
  update(@Body() body: UpdatePayload) {
    return this.itemsService.update(body);
  }

  @Get('items')
  getItems() {
    return this.itemsService.getItems();
  }

}
