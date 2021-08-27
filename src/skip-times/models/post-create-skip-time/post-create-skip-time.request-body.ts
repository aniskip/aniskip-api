import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SkipType } from '../../skip-times.types';

export class PostCreateSkipTimeRequestBody {
  @IsIn(['op', 'ed'])
  skipType!: SkipType;

  @IsString()
  providerName!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  startTime!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  endTime!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  episodeLength!: number;

  @IsUUID()
  submitterId!: string;
}
