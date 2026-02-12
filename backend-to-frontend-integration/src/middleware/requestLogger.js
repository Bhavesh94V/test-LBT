import morgan from 'morgan';

// Custom morgan format for logging
const morganFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// Create morgan middleware
export const requestLogger = morgan(morganFormat, {
  skip: (req, res) => {
    // Skip health check endpoints
    return req.path === '/health';
  },
});
