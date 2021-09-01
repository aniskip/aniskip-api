import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../repositories/repositories.module';
import { VoteService } from './vote.service';

@Module({
  imports: [RepositoriesModule],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
