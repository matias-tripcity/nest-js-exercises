import * as Nest from '@nestjs/common';
import * as NestCore from '@nestjs/core';
import type * as Commons from './';
import * as Packages from '../../packages';

@Nest.Injectable()
export class RepositoryService {
  public readonly client: Packages.Repository.Service;

  constructor(
    @Nest.Inject(NestCore.REQUEST)
    private readonly request: Commons.Types.CustomRequest,
  ) {
    this.client = Packages.Repository.Make({
      logger: this.request.logger,
    });
  }
}
