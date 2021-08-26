import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class PostCreateSkipTimeRequestParams {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  anime_id!: number;

  @IsNumber()
  @Min(0.5)
  @Type(() => Number)
  episode_number!: number;
}
