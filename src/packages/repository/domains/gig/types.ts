import type * as PackagesTypes from '../../..';

export type GigAccount = {
  id: string;
  driver_id: PackagesTypes.Repository.Driver['id'];
  provider: string;
};

export type GigRide = {
  id: string;
  gig_account_id: GigAccount['id'];
  rating: number;
};
