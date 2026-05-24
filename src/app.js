const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
// CORS — open to all origins. `origin: true` reflects the request's Origin header,
// which is required when credentials are sent (browsers reject "*" with credentials).
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CognitEng API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api', require('./routes/exerciseRoutes'));
app.use('/api', require('./routes/testRoutes'));
app.use('/api/diagnostics', require('./routes/diagnosticRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
