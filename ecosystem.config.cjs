module.exports = {
  apps: [{
    name: 'patent-search',
    script: 'src/app.js',
    port: '8030',
    error: './logs/error.log',
    log: './logs/info.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M',
    'env-development': {
      NODE_ENV: 'development'
    },
    'env-production': {
      NODE_ENV: 'production',
    }
  }]
};
