import safeStringify from 'fast-safe-stringify';
import * as winston from 'winston';

import * as Dependencies from './dependencies';

let logger: winston.Logger;

export const LogLevels = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

/* eslint-disable  @typescript-eslint/no-explicit-any */
type LoggerWrapper = (message: string, info?: Record<string, any>) => void;

type ErrorLog = {
  (error: Error): void;
  (message: string, info?: Record<string, any> | any[]): void;
};

const MessageValidator = Dependencies.MakeMessageValidator();

type LoggerConfig = {
  scope: string;
  attributes: Record<string, any>;
  debug?: boolean;
};

type LoggerForkConfig = {
  scope: string;
  attributes?: Record<string, any>;
  debug?: boolean;
};

export const MakeLogger = (config: LoggerConfig) => {
  const debugMode = config.debug;

  if (!logger) {
    if (debugMode) {
      console.debug(
        JSON.stringify({
          scope: config.attributes.scope,
          message: 'No logger found, instantiating Winston Logger',
        }),
      );
    }

    logger = winston.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
          handleRejections: true,
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.printf((meta) => {
              const parsedInfo = meta?.info
                ? {
                    ...meta,
                    info: JSON.parse(meta.info as any),
                  }
                : meta;
              return safeStringify(parsedInfo, undefined, 2);
            }),
          ),
        }),
      ],
    });
  }

  const scope = config.scope;

  let attributes = {
    ...config.attributes,
    'info.scope': scope,
  };

  if (debugMode) {
    logger.log(LogLevels.DEBUG, 'Scope Determined & Attributes parsed.', {
      info: safeStringify({ scope, attributes }),
    });
  }

  const debug: LoggerWrapper = (rawMessage, rawInfo) => {
    const { message, info } = MessageValidator.castToLogObject(
      rawMessage,
      rawInfo,
    );

    logger.log(LogLevels.DEBUG, message, {
      info: safeStringify({ scope, ...info }),
    });
  };

  const log: LoggerWrapper = (rawMessage, rawInfo) => {
    const { message, info } = MessageValidator.castToLogObject(
      rawMessage,
      rawInfo,
    );
    logger.log(LogLevels.INFO, message, {
      info: safeStringify({ scope, ...info }),
    });
  };

  const info: LoggerWrapper = (rawMessage, rawInfo) => {
    const { message, info } = MessageValidator.castToLogObject(
      rawMessage,
      rawInfo,
    );
    logger.log(LogLevels.INFO, message, {
      info: safeStringify({ scope, ...info }),
    });
  };

  const warn: ErrorLog = (...args) => {
    const { message, info } = MessageValidator.castToLogObject(
      args[0],
      args[1],
    );
    logger.log(LogLevels.WARNING, message, {
      info: safeStringify({ scope, ...info }),
    });
  };

  const error: ErrorLog = (...args) => {
    const { message, info } = MessageValidator.castToLogObject(
      args[0],
      args[1],
    );
    logger.log(LogLevels.ERROR, message, {
      info: safeStringify({ scope, ...info }),
    });
  };

  const appendAttributes = (newAttributes: Record<string, any>) => {
    const mergedAttributes = { ...newAttributes, ...attributes };
    if (debugMode) {
      logger.log(LogLevels.DEBUG, 'Attributes appended.', {
        info: safeStringify({ scope, attributes: mergedAttributes }),
      });
    }
    attributes = mergedAttributes;
  };

  const fork = (forkConfig: LoggerForkConfig) => {
    const castForkConfig: LoggerConfig = {
      scope: attributes['info.scope'] + '::' + forkConfig.scope,
      debug: forkConfig.debug || config.debug,
      attributes: {
        ...forkConfig.attributes,
        ...attributes,
      },
    };

    return MakeLogger(castForkConfig);
  };

  return {
    debug,
    log,
    info,
    warn,
    error,
    appendAttributes,
    fork,
  };
};

export type Service = ReturnType<typeof MakeLogger>;
