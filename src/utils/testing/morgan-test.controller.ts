import { Controller, Get } from '@nestjs/common';

@Controller()
export class MorganTestController {
  @Get('test')
  getTest(): string {
    return 'hello world';
  }
}
