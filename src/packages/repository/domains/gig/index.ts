import * as Packages from '../../..';

const gigAccounts: Packages.Repository.GigAccount[] = [
  {
    id: 'gig_account_1',
    driver_id: 'driver_1',
    provider: 'Uber',
  },
  {
    id: 'gig_account_2',
    driver_id: 'driver_2',
    provider: 'Lyft',
  },
  {
    id: 'gig_account_3',
    driver_id: 'driver_3',
    provider: 'Doordash',
  },
  {
    id: 'gig_account_4',
    driver_id: 'driver_1',
    provider: 'Lyft',
  },
];

const gigRides: Packages.Repository.GigRide[] = [
  { id: 'ride_1', gig_account_id: 'gig_account_1', rating: 5 },
  { id: 'ride_2', gig_account_id: 'gig_account_1', rating: 4 },
  { id: 'ride_3', gig_account_id: 'gig_account_1', rating: 3 },
  { id: 'ride_4', gig_account_id: 'gig_account_1', rating: 5 },
  { id: 'ride_5', gig_account_id: 'gig_account_2', rating: 2 },
  { id: 'ride_6', gig_account_id: 'gig_account_2', rating: 3 },
  { id: 'ride_7', gig_account_id: 'gig_account_2', rating: 4 },
  { id: 'ride_8', gig_account_id: 'gig_account_3', rating: 1 },
  { id: 'ride_9', gig_account_id: 'gig_account_3', rating: 5 },
  { id: 'ride_10', gig_account_id: 'gig_account_4', rating: 2 },
];

export const Make = (config: { logger: Packages.Logger.Service }) => {
  const listGigAccounts = async (): Promise<
    Packages.Repository.GigAccount[]
  > => {
    const methodLogger = config.logger.fork({ scope: 'listGigAccounts' });
    methodLogger.debug('Listing Gig Accounts');

    return gigAccounts;
  };

  const listGigRides = async (): Promise<Packages.Repository.GigRide[]> => {
    const methodLogger = config.logger.fork({ scope: 'listGigRides' });
    methodLogger.debug('Listing Gig Rides');

    return gigRides;
  };

  return {
    listGigAccounts,
    listGigRides,
  };
};
