import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/cli.ts',
    './src/listen.ts',
  ],
  noExternal: [
    'changelogen',
  ],
  publint: true,
  platform: 'node',
})
