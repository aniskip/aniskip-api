import { IsArray, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { SkipType } from '../../skip-times.types';
import { IsUnique } from '../../../utils';

export class GetSkipTimesRequestQuery {
  @IsUnique()
  @IsArray()
  @IsIn(['op', 'ed'], { each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  types!: SkipType[];
}
