import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class PostCreateSkipTimeRequestParams {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    minimum: 1,
    description: 'MAL id of the anime to create a new skip time for',
  })
  animeId!: number;

  @IsNumber()
  @Min(0.5)
  @Type(() => Number)
  @ApiProperty({
    type: 'number',
    format: 'double',
    minimum: 0.5,
    description: 'Episode number of the anime to to create a new skip time for',
  })
  episodeNumber!: number;
}
