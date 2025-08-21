import type * as Express from 'express';
import * as Packages from '../../../packages';

type BaseRequest = Express.Request & {
  logger: Packages.Logger.Service;
};

export type CustomRequest = BaseRequest & {
  user: any;
};
