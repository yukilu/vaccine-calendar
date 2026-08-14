import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import './db.js';
import { vaccineRouter } from './routes/vaccines.js';

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || (isProd ? 80 : 3000);

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/vaccines', vaccineRouter);

// 生产环境：由后端托管前端静态文件
// 前端产物放在 server/dist/dist，即 index.js 同目录下的 dist 文件夹
if (isProd) {
  const clientDist = path.resolve(__dirname, 'dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // 非接口的 GET 请求回退到 index.html
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(clientDist, 'index.html'));
      }
      next();
    });
  } else {
    console.warn(`[warn] 未找到前端构建目录: ${clientDist}，请先执行 npm run build`);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} (${isProd ? 'production' : 'development'})`);
});
