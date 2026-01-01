import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.css': 'copy',
    };
  },
  publicDir: false,
  onSuccess: async () => {
    // Copy CSS file to dist
    const fs = await import('fs');
    const path = await import('path');
    const srcCss = path.join(process.cwd(), 'src', 'styles.css');
    const distCss = path.join(process.cwd(), 'dist', 'styles.css');
    if (fs.existsSync(srcCss)) {
      fs.copyFileSync(srcCss, distCss);
    }
  },
});

