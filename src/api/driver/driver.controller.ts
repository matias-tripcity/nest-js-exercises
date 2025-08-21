import * as Nest from '@nestjs/common';
import * as NestSwagger from '@nestjs/swagger';
import { DriverService } from './driver.service';

@NestSwagger.ApiTags('Drivers')
@Nest.Controller({ path: 'drivers', version: '1' })
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Nest.Get('/')
  listDrivers() {
    return this.driverService.listDrivers();
  }
}
