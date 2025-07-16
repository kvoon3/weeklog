module.exports = {
  apps: [
    {
      name: 'weeklog',
      script: './dist/cli.js',
      instances: 1,
      cron_restart: '30 18 * * *',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      args: 'input1 input2 --output outputPath',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      autorestart: true,
    },
  ],
}
