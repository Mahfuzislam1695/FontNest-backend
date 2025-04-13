import { Test, TestingModule } from '@nestjs/testing';
import { FontGroupsController } from './font-groups.controller';
import { FontGroupsService } from './font-groups.service';

describe('FontGroupsController', () => {
  let controller: FontGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FontGroupsController],
      providers: [FontGroupsService],
    }).compile();

    controller = module.get<FontGroupsController>(FontGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
