import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { SkipType } from '../../../skip-times.types';
import { IsUnique } from '../../../../utils';

export class GetSkipTimesRequestQueryV2 {
  @IsUnique()
  @IsArray()
  @IsIn(['op', 'ed'], { each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @ApiProperty({
    type: [String],
    enum: ['op', 'ed'],
    description: 'Type of skip time to get',
  })
  types!: SkipType[];
}
