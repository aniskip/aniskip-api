import { SkipTime } from '../../skip-times.types';

export class GetSkipTimesResponse {
  statusCode!: number;

  message!: string;

  found!: boolean;

  results!: SkipTime[];
}
