//Ocurre la magia del Registro. Creo una función que recibe los datos, los valida, encripta la clave y guarda.

import bcrypt from 'bcrypt' //libreria para encriptar contrasenas 
import jwt from 'jsonwebtoken'; //libreria para crear los tokens de seguridad
import * as userModel from '../models/users.js' //traigo todas las funciones del model. 

//el numero de vueltas que dara el servidor para encriptar . 10 es el estandar. 
const saltRounds = 10;

//*--> funcion para manejar el REGISTRO de nuevos usuarios
export const register = async (req, res, next) => {
  try {
    // Extraigo los datos que el usuario escribió en el formulario (enviados en el cuerpo de la petición)
    const { username, email, password } = req.body || {};

    // --- 1. VALIDACIÓN (Punto 2) ---
    // Verificamos que no falte ningún dato. Si falta algo, devolvemos error 400 (Bad Request).
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    // --- 2. ENCRIPTACIÓN (Punto 2) ---
    // NUNCA guardo la contraseña en texto plano. 
    // bcrypt.hash toma la clave y la convierte en un código ilegible.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // --- 3. GUARDADO EN BASE DE DATOS ---
    // Llamo a la función del Modelo que creamos antes, pasándole la contraseña YA encriptada.
    const newUser = await userModel.createUser(username, email, hashedPassword);

    // Si todo salió bien, responder con código 201 (Creado) y los datos del nuevo usuario
    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: newUser
    });

  } catch (error) {
    // Si algo falla (ej. el email ya existe o cayó la base de datos),
    // la función 'next(error)' envía el fallo al manejador de errores global que pusimos en server.js
    next(error);
  }
};

// *---> Funcion para el loggin : 
// req (lo que mando,)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // Buscamos al usuario en Neon por su email
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparamos la contraseña de Postman con el hash de la DB
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generamos los dos Tokens (Access y Refresh)
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Guardamos el Refresh Token en una Cookie segura
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login exitoso",
      accessToken,
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error) {
    next(error);
  }
};












//esta funcion es para  darle una extension de tiempo al usuario, sin tener que volver a pedirle la contrasena de vuelta en un corto periodo de timepo
//se usa para cuando el token expiro, pero el usuario sigue activo.
export const refreshToken = (req, res) => {
  // 1. OBTENER EL REFRESH TOKEN DE LA COOKIE
  //cookieParser lee la cookie que envie al principio. 
  const refreshToken = req.cookies.refreshToken;
  //si no hay cookie, significa que el usuario no esta logeado, o que la sesion expiro del todo. 
  if (!refreshToken) {
    return res.status(403).json({ message: "No hay refresh token, inicie sesión" });
  }

  // 2. VALIDAR EL REFRESH TOKEN
//uso el secreto especifico para Refresh Tokens que guarde en el .env
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
//si la cookie fue manipulada, o ya pasaron los 7 dias de validez.. so.
    if (err) {
      return res.status(403).json({ message: "Refresh token inválido o expirado" });
    }
    // 3. GENERAR UN NUEVO ACCESS TOKEN
    //si la cookie es valida, saco el id del usuario que venia dentro de ella y genero un nuevo token para que siga navegando.
    const newAccessToken = jwt.sign(
      { userId: user.userId }, // Datos del usuario
      process.env.JWT_SECRET,   // Secreto del Access Token
      { expiresIn: "15m" }      // Nueva duración de 15 minutos
    );
    // 4. ENVIAR AL CLIENTE
//solo envio el nuevo acceso token, la token de refresh sigue guardada en el navegador.     
    res.json({ accessToken: newAccessToken });
  });
};
