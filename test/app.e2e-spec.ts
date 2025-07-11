import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ItemsService } from '../src/items/items.service';
import { Interface2 } from 'src/shared/types/external-api/global';
import * as TestClient from './data/test-client.json';


describe('Items test', () => {
  let app: INestApplication<App>;
  let itemsService: ItemsService;
  let id: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    //get available items
    itemsService = moduleFixture.get<ItemsService>(ItemsService);
    const availableItems = await itemsService.getItems();
    expect(availableItems.items.length).toBeGreaterThan(0);
    id = availableItems.items.find((item: Interface2) => item.id).id;
  });
  it('/items/items, (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/items/items');

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it('/items/:id/update, (PUT)', async () => {
    expect(id).toBeDefined();
    const response = await request(app.getHttpServer())
      .put(`/items/${id}/update`);

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Item updated');
  });

  afterAll(async () => {
    // Close the application after tests

  });
});

