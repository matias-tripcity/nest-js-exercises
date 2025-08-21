import * as Nest from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { CommonsModule } from '../commons/commons.module';
import { GigModule } from '../gig/gig.module';

@Nest.Module({
  imports: [CommonsModule, GigModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
