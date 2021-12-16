import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { SkipTypeV1, SkipTypesV1 } from '../../../skip-times.types';
import { IsUnique } from '../../../../utils';

export class GetSkipTimesRequestQueryV1 {
  @IsUnique()
  @IsArray()
  @IsIn(SkipTypesV1, { each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @ApiProperty({
    type: [String],
    enum: SkipTypesV1,
    description: 'Type of skip time to get',
  })
  types!: SkipTypeV1[];
}
