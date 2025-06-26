import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutSuccessService } from './checkout-success.service';

describe('CheckoutSuccessService', () => {
  let service: CheckoutSuccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckoutSuccessService],
    }).compile();

    service = module.get<CheckoutSuccessService>(CheckoutSuccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
