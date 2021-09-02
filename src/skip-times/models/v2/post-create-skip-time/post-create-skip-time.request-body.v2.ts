import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SkipType } from '../../../skip-times.types';

export class PostCreateSkipTimeRequestBodyV2 {
  @IsIn(['op', 'ed'])
  @ApiProperty({ type: String, enum: ['op', 'ed'] })
  skipType!: SkipType;

  @IsString()
  @ApiProperty()
  providerName!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  startTime!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  endTime!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  episodeLength!: number;

  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  submitterId!: string;
}
