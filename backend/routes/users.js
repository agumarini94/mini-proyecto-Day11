import {Router} from 'express'
import { register, login, refreshToken } from '../controllers/authControllers.js';
import { authenticateToken } from '../middlewares/auth.js'; 

const router = Router();

router.post('/register', register); 
router.post('/login', login);
router.post('/refresh', refreshToken);

// Ejemplo de una ruta protegida (solo si estás logueado)
router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Este es tu perfil", userId: req.user.userId });
});

// router.get("/", (req, res) => res.send("Ruta de usuario funcionando"));

// export default function users() {
//   return (
//     <div>users</div>
//   )
// }
export default router; 

