import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';
import storiesRouter from './routes/stories.js';
import contributorsRouter from './routes/contributors.js';

const app = express();

// 1. Middlewares básicos
app.use(express.json());
app.use(cookieParser());

// 2. Configuración de CORS
const allowedOrigins = [
    'https://mini-proyecto-frontend.onrender.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (como Postman) o si está en la lista blanca
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// Aplicar CORS a todas las rutas
app.use(cors(corsOptions));

// 3. Verificación de entorno
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
    console.log("Corriendo en modo: Desarrollo");
}

// 4. Rutas
app.use('/api/user', userRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/contributors', contributorsRouter);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Servidor funcionando" });
});

// 5. Control de errores
app.use((err, req, res, next) => {
    // Si el error es de CORS, lo manejamos específicamente
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