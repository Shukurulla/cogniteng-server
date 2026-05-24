/**
 * PM2 ecosystem for CognitEng Lite backend API.
 *
 * Usage on server:
 *   cd /path/to/cogniteng/backend
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup        # follow the printed instruction once
 */

module.exports = {
  apps: [
    {
      name: 'cogniteng-backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 9817,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      time: true,
    },
  ],
};
