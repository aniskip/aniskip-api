import { IsUUID } from 'class-validator';

export class PostVoteRequestParams {
  @IsUUID()
  skipId!: string;
}
