import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import fs from 'fs';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    keepNames: true,
  },
  server: {
    host: true,
    port: 5173,
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'certs', 'key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'cert.pem'))
    }
  }
});
