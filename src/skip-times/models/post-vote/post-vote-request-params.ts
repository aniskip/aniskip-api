import { IsUUID } from 'class-validator';

export class PostVoteRequestParams {
  @IsUUID()
  skip_id!: string;
}
