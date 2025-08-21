import { Logger } from '../../packages';
import * as Nest from '@nestjs/common';
import type * as Express from 'express';
import { CustomRequest } from '../commons/types';

@Nest.Injectable()
export class LoggerMiddleware implements Nest.NestMiddleware {
  constructor() {}

  use(req: CustomRequest, res: Express.Response, next: Express.NextFunction) {
    const scope = req.method + '::' + req.url;

    const environment = 'local';

    const logger = Logger.MakeLogger({
      attributes: {
        'service.name': `insurance-service-api-${environment}`,
        'service.namespace': scope,
        'deployment.environment': environment,
        'http.method': req.method,
      },
      scope: scope,
    });

    req.logger = logger;

    if (req.url !== '/api/health')
      req.logger.debug('Incoming Request', {
        method: req.method,
        url: req.url,
        query: {
          ...req.query,
          password: req.query?.password ? 'REDACTED' : undefined,
        },
        body: {
          ...req.body,
          password: req.body?.password ? 'REDACTED' : undefined,
        },
      });

    interceptAllResponses({ res, logger });

    next();
  }
}

const interceptAllResponses = (args: {
  res: Express.Response;
  logger: Logger.Service;
}) => {
  const originalResponseEndRef = args.res.end;
  const chunkBuffers = [];

  args.res.end = (...chunks: any[]) => {
    for (const chunk of chunks) {
      if (chunk) {
        chunkBuffers.push(Buffer.from(chunk));
      }
    }
    const body = Buffer.concat(chunkBuffers).toString('utf8');

    try {
      const statusCode = args.res.statusCode;

      args.logger.appendAttributes({
        'http.response.status': statusCode,
      });

      if (body === '') {
        args.logger.debug(
          'Response body is empty string, could be Nest Cached response',
          {
            statusCode,
            body,
          },
        );

        originalResponseEndRef.apply(args.res, chunks);

        return args.res;
      }

      const parsedBody = JSON.parse(body);
      if (parsedBody.code && parsedBody.message) {
        args.logger.warn('Response Body', { body: parsedBody });
      }
    } catch (e) {
      args.logger.error(
        '[Logger Middleware] - Failed to process response body',
        { message: e.message },
      );
    }

    originalResponseEndRef.apply(args.res, chunks);

    return args.res;
  };
};
