import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { DemoDataService } from './demo-data.service';

describe('DemoDataService', () => {
  let service: DemoDataService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemoDataService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DemoDataService>(DemoDataService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('placeOrder', () => {
    it('should place an order', async () => {
      const response = {
        data: {
          orderId: '1234',
        },
      };
      jest
        .spyOn(httpService, 'post')
        // eslint-disable-next-line
        // @ts-ignore
        .mockImplementationOnce(() => of(response));

      const result = await service.placeOrder('buy', 1, 1);
      expect(result).toEqual(response.data);
    });
  });
});
