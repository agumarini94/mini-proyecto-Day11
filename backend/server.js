import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';
import storiesRouter from './routes/stories.js';
import contributorsRouter from './routes/contributors.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configuración de CORS Dinámica
const allowedOrigins = [
    'https://mini-proyecto-frontend.onrender.com',
    'https://backend-dia11.onrender.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir si el origen está en la lista o si no hay origen (Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Error: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// 3. Rutas
app.use('/api/user', userRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/contributors', contributorsRouter);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", url: "https://backend-dia11.onrender.com" });
});

// 4. Control de errores (importante para no morir en el deploy)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});