import { SkipTime } from '../../skip-times.types';

export class GetSkipTimesResponse {
  status_code!: number;

  message!: string;

  found!: boolean;

  results!: SkipTime[];
}
