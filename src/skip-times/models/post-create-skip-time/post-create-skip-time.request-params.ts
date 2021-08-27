import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class PostCreateSkipTimeRequestParams {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  animeId!: number;

  @IsNumber()
  @Min(0.5)
  @Type(() => Number)
  episodeNumber!: number;
}
