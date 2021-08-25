import { Controller, Get } from '@nestjs/common';
import { SkipTimesService } from './skip-times.service';

@Controller({
  path: 'skip-times',
  version: '1',
})
export class SkipTimesControllerV1 {
  constructor(private skipTimesService: SkipTimesService) {}

  @Get('hello')
  getSkipTimes(): string {
    return this.skipTimesService.hello();
  }
}
