import * as Nest from '@nestjs/common';
import { GigController } from './gig.controller';
import { GigService } from './gig.service';
import { CommonsModule } from '../commons/commons.module';

@Nest.Module({
  imports: [CommonsModule],
  controllers: [GigController],
  providers: [GigService],
  exports: [GigService],
})
export class GigModule {}
