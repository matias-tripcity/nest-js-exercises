import * as Nest from '@nestjs/common';
import * as NestCore from '@nestjs/core';
import * as Packages from '../../packages';
import * as Commons from '../commons';

@Nest.Injectable()
export class GigService {
  private readonly logger: Packages.Logger.Service;
  private readonly Repository: Packages.Repository.Service;

  constructor(
    @Nest.Inject(NestCore.REQUEST)
    private readonly request: Commons.Types.CustomRequest,
    private readonly RepositoryInstance: Commons.RepositoryService,
  ) {
    this.logger = this.request.logger.fork({ scope: 'GigService' });
    this.Repository = this.RepositoryInstance.client;
  }

  listGigAccounts() {
    return this.Repository.Gig.listGigAccounts();
  }

  listGigRides() {
    return this.Repository.Gig.listGigRides();
  }
}
