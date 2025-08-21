import * as Nest from '@nestjs/common';
import * as NestCore from '@nestjs/core';
import * as Packages from '../../packages';
import * as Commons from '../commons';
import { GigService } from '../gig/gig.service';

type GetDriverStatusResult = {
  driver: Packages.Repository.Driver;
  avg_rating: number;
  status: 'accepted' | 'rejected';
};

@Nest.Injectable()
export class DriverService {
  private readonly logger: Packages.Logger.Service;
  private readonly Repository: Packages.Repository.Service;

  constructor(
    @Nest.Inject(NestCore.REQUEST)
    private readonly request: Commons.Types.CustomRequest,
    private readonly RepositoryInstance: Commons.RepositoryService,
    private readonly GigService: GigService,
  ) {
    this.logger = this.request.logger.fork({ scope: 'Service' });
    this.Repository = this.RepositoryInstance.client;
  }

  listDrivers() {
    return this.Repository.Driver.list();
  }

  async getDriversStatus(): Promise<GetDriverStatusResult[]> {
    return [] as any; //REMOVE THIS LINE AND ADD THE ACTUAL IMPLEMENTATION
  }
}
