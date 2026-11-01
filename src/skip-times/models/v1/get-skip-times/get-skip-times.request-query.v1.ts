import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn } from 'class-validator';
import { IsUnique } from '../../../../utils';
import { SKIP_TYPES_V1, type SkipTypeV1 } from '../../../skip-times.types';

export class GetSkipTimesRequestQueryV1 {
  @IsUnique()
  @IsArray()
  @IsIn(SKIP_TYPES_V1, { each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @ApiProperty({
    type: [String],
    enum: SKIP_TYPES_V1,
    description: 'Type of skip time to get',
  })
  types!: SkipTypeV1[];
}
