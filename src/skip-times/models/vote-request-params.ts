import { IsUUID } from 'class-validator';

export class VoteRequestParams {
  @IsUUID()
  skip_id!: string;
}
