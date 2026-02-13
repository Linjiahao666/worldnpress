module.exports = {
  apps: [
    {
      name: "worldnpress",
      script: ".output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
        NUXT_HOST: "0.0.0.0",
        NUXT_PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      // 日志
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
