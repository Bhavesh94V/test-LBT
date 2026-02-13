// Graceful error handling for Mongoose operations
// This allows routes to continue functioning even if MongoDB isn't available

export const withDBFallback = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // If it's a Mongoose connection error, return a friendly error
      if (
        error.message.includes('not connected') ||
        error.message.includes('ECONNREFUSED') ||
        error.name === 'MongooseConnectionError' ||
        error.name === 'MongooseServerSelectionError'
      ) {
        return res.status(503).json({
          success: false,
          message: 'Database service temporarily unavailable. Using sandbox mode.',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable',
        });
      }
      
      // Re-throw other errors
      next(error);
    }
  };
};

export default withDBFallback;
