import * as Domains from './domains';
import * as Packages from '..';

export const Make = (config: { logger: Packages.Logger.Service }) => {
  const logger = config.logger.fork({ scope: 'Repository' });

  return {
    Driver: Domains.Driver.Make({ logger: logger.fork({ scope: 'Driver' }) }),
    Gig: Domains.Gig.Make({ logger: logger.fork({ scope: 'Gig' }) }),
  };
};

export type Service = ReturnType<typeof Make>;
