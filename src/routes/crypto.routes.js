import { encriptar, desencriptar, encriptarDatoConIVFijo, desencriptarDatoConIVFijo } from "../controllers/crypto.controller.js";
import { Router } from "express";

const router = Router();

router.post('/encriptar', encriptar);
router.post('/desencriptar', desencriptar);
router.post('/encriptarIV', encriptarDatoConIVFijo);
router.post('/desencriptarIV', desencriptarDatoConIVFijo);

export default router;