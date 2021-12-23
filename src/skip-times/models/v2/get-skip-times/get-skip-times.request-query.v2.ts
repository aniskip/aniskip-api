import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
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

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
    description:
      'Approximate episode length to search for. If the input is 0, it will return all episodes',
  })
  episodeLength!: number;
}
