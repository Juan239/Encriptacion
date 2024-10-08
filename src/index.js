import express from 'express';
import cors from 'cors';
import cryptoRoutes from './routes/crypto.routes.js';

const app = express();
const port = 3117;

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET, POST, PUT, DELETE"]
}));

app.use(express.json());

app.use('/api', cryptoRoutes);

app.listen(port, () => {
    console.log(`Sistema corriendo en ${port}`);
});