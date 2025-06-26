import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutSuccessController } from './checkout-success.controller';

describe('CheckoutSuccessController', () => {
  let controller: CheckoutSuccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutSuccessController],
    }).compile();

    controller = module.get<CheckoutSuccessController>(CheckoutSuccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
