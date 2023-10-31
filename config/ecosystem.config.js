module.exports = {
  apps: [
    {
      name: 'my-react-app',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};