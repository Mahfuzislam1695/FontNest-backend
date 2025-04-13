import { Test, TestingModule } from '@nestjs/testing';
import { FontGroupsService } from './font-groups.service';

describe('FontGroupsService', () => {
  let service: FontGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FontGroupsService],
    }).compile();

    service = module.get<FontGroupsService>(FontGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
