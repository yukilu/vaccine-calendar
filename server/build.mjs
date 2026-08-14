import { build } from 'esbuild';
import fs from 'node:fs';

// 清理旧产物，确保 dist 只有一个文件
fs.rmSync('dist', { recursive: true, force: true });

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  outfile: 'dist/index.js',
  // 把 NODE_ENV 编译为 production，运行时无需再设置环境变量、无需 node_modules
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info',
});

console.log('server bundled -> dist/index.js');
