import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { SkipTypeV2, SKIP_TYPES_V2 } from '../../../skip-times.types';
import { IsUnique } from '../../../../utils';

export class GetSkipTimesRequestQueryV2 {
  @IsUnique()
  @IsArray()
  @IsIn(SKIP_TYPES_V2, { each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @ApiProperty({
    type: [String],
    enum: SKIP_TYPES_V2,
    description: 'Type of skip time to get',
  })
  types!: SkipTypeV2[];
}
