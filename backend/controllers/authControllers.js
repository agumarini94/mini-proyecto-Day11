import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/users.js';

const saltRounds = 10;

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await userModel.createUser(username, email, hashedPassword);

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: newUser
    });

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // --- CORRECCIÓN CLAVE AQUÍ ---
    // Cambiamos user.password_hash por user.password para que coincida con tu DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // --- VERIFICACIÓN DE SECRETOS ---
    if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
      console.error("❌ ERROR CRÍTICO: Faltan las variables JWT_SECRET o REFRESH_SECRET en Render.");
      throw new Error("Faltan variables de entorno para generar tokens.");
    }

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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Siempre true en Render por HTTPS
      sameSite: "none", // Necesario para que funcione entre dominios distintos (Render -> Frontend)
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login exitoso",
      accessToken,
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error) {
    // Esto imprimirá el error real en los Logs de Render antes de mandarte el "Intente más tarde"
    console.error("DETALLE DEL ERROR EN LOGIN:", error);
    next(error);
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "No hay refresh token, inicie sesión" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Refresh token inválido o expirado" });
    }

    // --- CORRECCIÓN AQUÍ ---
    // Usamos decoded.userId porque así lo guardamos arriba
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  });
};