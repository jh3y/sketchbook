import { defineConfig } from 'vite'
const fs = require('node:fs');

export default defineConfig({
  server: {
    port: 1987,
    host: true,
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem')
    }
  }
})