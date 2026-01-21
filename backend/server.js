import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';
import storiesRouter from './routes/stories.js';
import contributorsRouter from './routes/contributors.js';

const app = express();

// 1. Middlewares básicos obligatorios
app.use(express.json());
app.use(cookieParser());

// 2. Configuración de CORS Robusta
const allowedOrigins = [
    'https://mini-proyecto-frontend.onrender.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// --- SOLUCIÓN AL ERROR 403 PREFLIGHT ---
// Este middleware atrapa las peticiones OPTIONS y responde 200 OK inmediatamente
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
});
// ---------------------------------------

// 3. Verificación de entorno
const isDevelopment = process.env.NODE_ENV === 'development';

// 4. Rutas
app.use('/api/user', userRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/contributors', contributorsRouter);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Servidor funcionando" });
});

// 5. Control de errores
app.use((err, req, res, next) => {
    if (err.message === 'No permitido por CORS') {
        return res.status(403).json({ error: err.message });
    }
    console.error("DETALLE DEL ERROR:", err.stack);
    res.status(err.status || 500).json({
        error: "Ocurrió un error inesperado en el servidor",
        message: isDevelopment ? err.message : "Intente más tarde"
    });
});

// 6. Arranque
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`RUN ON ${PORT}`);
});