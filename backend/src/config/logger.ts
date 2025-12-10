type LogMethod = (message: string, meta?: Record<string, unknown>) => void;

const format = (level: string, message: string, meta?: Record<string, unknown>) =>
  meta ? `${level} ${message} ${JSON.stringify(meta)}` : `${level} ${message}`;

const logger: Record<'info' | 'warn' | 'error' | 'debug', LogMethod> = {
  info: (message, meta) => console.log(format('[INFO]', message, meta)),
  warn: (message, meta) => console.warn(format('[WARN]', message, meta)),
  error: (message, meta) => console.error(format('[ERROR]', message, meta)),
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(format('[DEBUG]', message, meta));
    }
  },
};

export default logger;

