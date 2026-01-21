//ESTE ARCHIVO ES PARA COMUNICARME CON EL NEON DB, USANDO EL POOL QUE CREE EN INDEX.JS. Neon solo maneja filas y columnas basicamente
import { query } from "../db/index.js";

//funcion para crear un nuevo usuario
export const createUser = async (username, email, hashedPassword) => {//defino la consulta sql.
    //uso $1 y $2 $3, para evitar inyecciones sql(hackeos), 
    const text = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email
    `; //el returning le dice a Postgress que nos devuelva los datos creados (como el id generado)
    //Meto los datos creados en un array. 
    const values = [username, email, hashedPassword];

    //ejecuto la consulta, y espero a que la bd me envie respuesta
    const res = await query(text, values);
    //res.rows --> es un array con los resultados. 
    //como solo inserte uno, devuelvo el objeto en la posicion 0.
    return res.rows[0];
}; 

//funcion para buscar un usuario por su correo: 
export const findUserByEmail = async (email) => {
    //busco en todas las columnas (*) donde el email coincida con el parametro $1:
    const res = await query('SELECT * FROM users WHERE email = $1', [email]); 
    //si lo encontro devuelve sus datos, sino devuelve 0.
    return res.rows[0];
}