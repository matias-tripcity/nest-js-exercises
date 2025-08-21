import * as Nest from '@nestjs/common';
import * as NestSwagger from '@nestjs/swagger';
import { GigService } from './gig.service';

@NestSwagger.ApiTags('Gigs')
@Nest.Controller({ path: 'gigs', version: '1' })
export class GigController {
  constructor(private readonly gigService: GigService) {}

  @Nest.Get('/gig-accounts')
  listGigAccounts() {
    return this.gigService.listGigAccounts();
  }

  @Nest.Get('/gig-rides')
  listGigRides() {
    return this.gigService.listGigRides();
  }
}
