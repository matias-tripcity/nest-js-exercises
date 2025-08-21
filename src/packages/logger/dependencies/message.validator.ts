import safeStringify from 'fast-safe-stringify';

/* eslint-disable  @typescript-eslint/no-explicit-any */
type ValidLogInfo = Record<string, any> | any[] | undefined;

type LogObject = {
  message: string;
  info: ValidLogInfo;
};

const isNull = (arg: unknown): arg is null => arg === null;
const isUndefined = (arg: unknown): arg is undefined => arg === undefined;
// @ts-expect-error opchaining avoids error if arg is null or doesn't have name property
const isErrorObject = (arg: unknown): arg is Error => arg?.name === 'Error';
const isArray = (arg: unknown): arg is any[] => Array.isArray(arg);
const isDate = (arg: unknown): arg is Date => arg instanceof Date;
const isObject = (arg: unknown): arg is Record<string, any> =>
  typeof arg === 'object' && !isNull(arg) && !isArray(arg) && !isDate(arg);
const isFunction = (arg: unknown): arg is (...args: any) => any =>
  typeof arg === 'function';
const isString = (arg: unknown): arg is string => typeof arg === 'string';
const isNumber = (arg: unknown): arg is number => typeof arg === 'number';
const isBoolean = (arg: unknown): arg is boolean => typeof arg === 'boolean';
const isBigInt = (arg: unknown): arg is bigint => typeof arg === 'bigint';

const MAX_LOG_BYTES = 100000; // 100kb

const checkSize = (arg: unknown) => {
  if (isUndefined(arg) || isNull(arg) || isBigInt(arg) || isFunction(arg))
    return arg;

  const stringifiedArg = safeStringify(arg);
  const bytes = Buffer.byteLength(stringifiedArg);

  const maxBytesExceeded = bytes > MAX_LOG_BYTES;

  if (!maxBytesExceeded) return arg;

  if (isString(arg)) {
    return {
      additional: `LOG SIZE EXCEEDED IN STRING: ${bytes} bytes`,
      contextHead: stringifiedArg.slice(0, 1000),
      contextTail: stringifiedArg.slice(-1000),
    };
  }

  if (isArray(arg)) {
    return {
      additional: `LOG SIZE EXCEEDED IN ARRAY: ${bytes} bytes`,
      contextHead: stringifiedArg.slice(0, 1000),
      contextTail: stringifiedArg.slice(-1000),
    };
  }

  if (isErrorObject(arg))
    return {
      additional: `LOG SIZE EXCEEDED IN ERROR: ${bytes} bytes`,
      contextHead: stringifiedArg.slice(0, 1000),
      contextTail: stringifiedArg.slice(-1000),
    };

  return {
    additional: `LOG SIZE EXCEEDED IN OBJECT: ${bytes} bytes`,
    contextHead: stringifiedArg.slice(0, 1000),
    contextTail: stringifiedArg.slice(-1000),
  };
};

const invalidMessageString = (type: string) =>
  `Invalid type "${type}" message Argument provided.`;

const castMessage = (arg: unknown): string => {
  if (isString(arg)) {
    return arg;
  }

  if (isNull(arg)) {
    return invalidMessageString('null');
  }

  if (isDate(arg)) {
    return invalidMessageString('Date');
  }

  if (isErrorObject(arg)) {
    return isString(arg.message) ? arg.message : safeStringify(arg.message);
  }

  if (isArray(arg)) {
    return 'Logging Array info Directly.';
  }

  if (isObject(arg)) {
    return (
      (isString(arg.message) ? arg.message : safeStringify(arg.message)) ||
      'Logging Object info Directly.'
    );
  }

  const messageType = typeof arg;
  return invalidMessageString(messageType);
};

const createCastString = (type: string) =>
  `Invalid "${type}" Argument Provided to info, expected object or array value.`;

const castInfo = (arg: unknown): ValidLogInfo => {
  if (isUndefined(arg)) return undefined;

  if (isNull(arg)) return undefined;

  if (isErrorObject(arg))
    return {
      name: arg.name,
      message: arg.message,
      stack: arg.stack,
    };

  if (isArray(arg)) return arg;

  if (isObject(arg)) return arg;

  if (isDate(arg)) return { data: arg, message: createCastString('Date') };
  if (isFunction(arg)) return { message: createCastString('function') };
  if (isString(arg)) return { data: arg, message: createCastString('string') };
  if (isNumber(arg)) return { data: arg, message: createCastString('number') };
  if (isBoolean(arg))
    return { data: arg, message: createCastString('boolean') };

  return { data: arg, message: createCastString('unknown') };
};

export const MakeMessageValidator = () => {
  const castToLogObject = (...args: unknown[]): LogObject => {
    try {
      const sizeCheckedMessage = checkSize(args[0]);

      // @ts-expect-error If additional exists, the string was over max log size
      if (isString(args[0]) && sizeCheckedMessage?.additional) {
        const sizeRes = sizeCheckedMessage as {
          additional: string;
          contextHead: string;
          contextTail: string;
        };

        return {
          message: sizeRes.additional,
          info: sizeRes,
        };
      }

      const message = castMessage(args[0]);

      if (isObject(args[0]) || isArray(args[0]) || isErrorObject(args[0])) {
        const sizeCheckedInfo = checkSize(args[0]);
        const info = castInfo(sizeCheckedInfo);

        return {
          message,
          info,
        };
      }

      const sizeCheckedInfo = checkSize(args[1]);
      const info = castInfo(sizeCheckedInfo);

      return {
        message,
        info,
      };
    } catch (err) {
      return {
        message: '[LoggerError] Unhandled exception parsing log arguments.',
        info: {
          name: err.name,
          error_message: err.message,
          stack: err.stack,
        },
      };
    }
  };

  return {
    castToLogObject,
  };
};
