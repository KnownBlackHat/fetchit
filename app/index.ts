import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { router } from './routes/v1';

const app = express();


app.use(express.json());
app.use(cors());
app.use(compression());



// app.use((req, _, next) => {
//     console.log(`${req.method} - ${req.url} ${JSON.stringify(req.body) ?? ''}`);
//     next();
// })

app.use('/api/v1', router);

app.listen(process.env.PORT || 3000);

export default app;
