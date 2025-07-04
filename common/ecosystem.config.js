module.exports = {
  apps: [
    {
      name: 'nextjs',
      script: 'node',
      args: '.next/standalone/server.js',
      cwd: '/app',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'api-server',
      script: 'npm',
      args: 'run start',
      cwd: '/app/server',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3334
      }
    }
  ]
}; 