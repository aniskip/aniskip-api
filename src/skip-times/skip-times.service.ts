import { Injectable } from '@nestjs/common';
import { SkipTimesRepository } from './skip-times.repository';

@Injectable()
export class SkipTimesService {
  constructor(private skipTimesRepository: SkipTimesRepository) {}
}
