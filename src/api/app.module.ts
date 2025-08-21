import * as Nest from '@nestjs/common';
import { DriverModule } from './driver/driver.module';
import { LoggerMiddleware } from './middleware';
import { CommonsModule } from './commons/commons.module';
import { GigModule } from './gig/gig.module';

@Nest.Module({
  imports: [CommonsModule, DriverModule, GigModule],
})
export class AppModule implements Nest.NestModule {
  configure(consumer: Nest.MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*path', method: Nest.RequestMethod.ALL });
  }
}
