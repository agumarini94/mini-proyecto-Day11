import express from 'express';
import cors from 'cors'; 
import 'dotenv/config'; // --> Carga las variables del .env.. 
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';//importa las rutas. 
import storiesRouter from './routes/stories.js';
import contributorsRouter from './routes/contributors.js';
const app = express();

app.use(express.json()); //para que el servidor entienda formato json . 

//Cors -> permite que el backend se comunique con el front end 
app.use(
    cors({
        credentials: true,
        origin: ['https://mini-proyecto-frontend.onrender.com',
            'http://localhost:5173'] //el puerto donde corre el frontend
    }),
); 
//cookieParser -> para que el servidor lea los cookies(necesario para los tokens de seguridad)
app.use(cookieParser()); 

//verificacion de entorno. --> 
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
    console.log("Corriendo en modo: Desarrollo");
}
//agrupa todas las rutas de usuario bajo el prefijo api/user
app.use('/api/user', userRouter);
//aca conecto con las stories y los contributores .
app.use('/api/stories', storiesRouter);
app.use('/api/contributors', contributorsRouter);


//ruta de prueba rapida para ver si el servidor esta funcionando
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Servidor funcionando" });
});

//control de errores. --> *Este bloque atrapa cualquier error para que la app no se bloquee * <--
app.use((err, req, res, next) => {
    console.error("DETALLE DEL ERROR:", err.stack); // Solo tú lo ves en consola

    res.status(err.status || 500).json({
        // Mensaje útil para el usuario, sin revelar detalles técnicos peligrosos
        error: "Ocurrió un error inesperado en el servidor",
        // En desarrollo puedes ver más info, en producción nada
        message: isDevelopment ? err.message : "Intente más tarde"
    });
});







//arranque del servidor 
const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => {
    console.log(`RUN ON ${PORT}`);
});


