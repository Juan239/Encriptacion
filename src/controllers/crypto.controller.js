import { log } from 'console';
import crypto from 'crypto';
import { config } from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
config();

// Obtener la clave secreta desde el archivo .env
const secretKey = process.env.SECRET_KEY;
const secretIV = process.env.SECRET_IV;

if (!secretKey) {
    throw new Error('Error obteniendo la clave secreta');
}

if (secretKey.length !== 64) {
    throw new Error('La clave secreta debe tener 64 caracteres (32 bytes en hexadecimal).');
}



// Función para encriptar un dato con IV fijo
export const encriptarDatoConIVFijo = (req, res) => {
    const dato = req.body.data;

    if (!secretIV || Buffer.from(secretIV, 'hex').length !== 16) {
        throw new Error('El IV debe tener exactamente 16 bytes (32 caracteres en hexadecimal).');
    }

    const iv = Buffer.from(secretIV, 'hex'); // Convertir IV desde hexadecimal
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey, 'hex'), iv);

    let encrypted = cipher.update(dato, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return res.status(200).json({ data: encrypted });
};

// Función para desencriptar un dato con IV fijo
export const desencriptarDatoConIVFijo = (req, res) => {
    const datoEncriptado = req.body.data;

    if (!secretIV || Buffer.from(secretIV, 'hex').length !== 16) {
        throw new Error('El IV debe tener exactamente 16 bytes (32 caracteres en hexadecimal).');
    }

    const iv = Buffer.from(secretIV, 'hex'); // Convertir IV desde hexadecimal
    const encryptedText = Buffer.from(datoEncriptado, 'hex');

    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey, 'hex'), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return res.status(200).json({ data: decrypted.toString() });
};


export const encriptar = (req, res) => {
    console.log("Encriptando...");

    const data = req.body.data;

    if (!data) {
        return res.status(400).json({ error: 'No se proporcionaron datos para encriptar' });
    }

    // Función que encripta un solo dato
    const encriptarDato = (dato) => {
        const iv = crypto.randomBytes(16); // Generar un IV aleatorio
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey, 'hex'), iv);

        let encrypted = cipher.update(dato, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Concatenar IV y el texto encriptado para facilitar el desencriptado posterior
        return iv.toString('hex') + ':' + encrypted;
    };

    let resultado;

    // Si el argumento es un array, encripta cada elemento; si no, encripta un solo dato
    if (Array.isArray(data)) {
        resultado = data.map(encriptarDato);
    } else {
        resultado = encriptarDato(data);
    }

    // Enviar el resultado encriptado como respuesta
    return res.json({ encryptedData: resultado });
};

// Función para desencriptar, acepta un dato simple o un array
export const desencriptar = (req, res) => {
    const data = req.body.data;
    console.log(data);
    

    if (!data) {
        return res.status(400).json({ error: 'No se proporcionaron datos para desencriptar' });
    }

    console.log("Desencriptando...");

    // Función que desencripta un solo dato
    const desencriptarDato = (dato) => {
        const [ivHex, encryptedData] = dato.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedData, 'hex');

        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey, 'hex'), iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    };

    let resultado;

    // Si el argumento es un array, desencripta cada elemento; si no, desencripta un solo dato
    if (Array.isArray(data)) {
        resultado = data.map(desencriptarDato);
    } else {
        resultado = desencriptarDato(data);
    }

    // Enviar el resultado desencriptado como respuesta
    return res.json({ decryptedData: resultado });
};