import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetRelationRulesRequestParams {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  animeId!: number;
}
