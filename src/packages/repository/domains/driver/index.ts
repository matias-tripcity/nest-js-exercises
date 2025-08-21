import * as Packages from '../../..';

const drivers: Packages.Repository.Driver[] = [
  {
    id: 'driver_1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
  },
  {
    id: 'driver_2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
  },
  {
    id: 'driver_3',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
  },
];

export const Make = (config: { logger: Packages.Logger.Service }) => {
  const list = async (): Promise<Packages.Repository.Driver[]> => {
    const methodLogger = config.logger.fork({ scope: 'getDrivers' });
    methodLogger.debug('Getting Drivers');

    return drivers;
  };

  return {
    list,
  };
};
