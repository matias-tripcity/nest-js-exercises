import * as Nest from '@nestjs/common';
import { RepositoryService } from './repository.service';

@Nest.Module({
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class CommonsModule {}
