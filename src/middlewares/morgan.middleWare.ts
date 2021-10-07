import morgan, { StreamOptions } from 'morgan';
import logger from 'logger';

const stream: StreamOptions = {
  write: (message) => logger.http(message.trim())
};
let format: string;
if (process.env.SERVER_ENV === 'dev') {
  format = ':method :url :status :response-time ms - :res[content-length]';
} else {
  format =
    ':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" :user-agent - :response-time ms';
}
// Build the morgan middleware
const morganMiddleware = morgan(format, { stream });

export default morganMiddleware;
