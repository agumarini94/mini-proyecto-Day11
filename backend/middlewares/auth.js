import jwt from 'jsonwebtoken';

/**
 * Este middleware es para verificar si el usuario tiene permiso de entrar
 * Recibe: req (petición), res (respuesta) y next (la función que sigue)
 */
export const authenticateToken = (req, res, next) => {
    // 1. EXTRAER EL TOKEN DEL ENCABEZADO
    // Los navegadores envían el token en 'Authorization'. 
    // El formato estándar es: "Bearer asdasd123token..."
    const authHeader = req.headers['authorization']; // *--> aca mando el token

    // Divido el string  y agarro la segunda parte [1]
    // El "&&" asegura que si no viene el header, no se rompa el código
    const token = authHeader && authHeader.split(' ')[1];

    // 2. VALIDAR SI EL TOKEN EXISTE
    // Si el cliente no mando nada, devuelvo error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ message: "No hay token, autorización denegada" });
    }

    // 3. VERIFICAR EL TOKEN 
    // Uso la librería y NUESTRO SECRETO del .env para desencriptarlo
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        //! Si el token expiró, es falso o alguien lo manipuló, devolvemos 403 (Prohibido)
        if (err) {
            return res.status(403).json({ message: "Token no es válido o ha expirado" });
        }

        // Si todo está OK, guardamos la info del usuario dentro del objeto 'req'
        // Esto permite que las rutas siguientes sepan QUÉ usuario está haciendo la acción
        req.user = user;

        // 4. DAR EL PASO
        // 'next()' es lo que le dice a Express: "Todo bien, podés ejecutar el controlador"
        next();
    });
};



/**Este archivo es el Middleware. Imaginalo como un guardia de seguridad que se para en la puerta de tus rutas privadas. Antes de dejar pasar a alguien (a una función de controlador), le pide su identificación (el token) y verifica que sea real. */