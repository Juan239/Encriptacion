import { encriptar, desencriptar } from "../controllers/crypto.controller.js";
import { Router } from "express";

const router = Router();

router.post('/encriptar', encriptar);
router.post('/desencriptar', desencriptar);

export default router;