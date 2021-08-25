import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SkipType } from 'src/skip-times/skip-times.types';

export class PostCreateSkipTimeRequestBody {
  @IsIn(['op', 'ed'])
  skip_type!: SkipType;

  @IsString()
  provider_name!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  start_time!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  end_time!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  episode_length!: number;

  @IsUUID()
  submitter_id!: string;
}
