import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://mothermachine.studio',
  build: { format: 'file' },
});
