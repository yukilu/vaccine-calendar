import express from 'express';
import cors from 'cors';
import './db.js';
import { vaccineRouter } from './routes/vaccines.js';

const app = express();
const PORT = Number(process.env.PORT) || 3007;

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/vaccines', vaccineRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
