"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = require("./crypto");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 4000;
/* -------------------------------------------------------------
   Load the server's private key from .env (Base‑64, ORIGINAL)
   ------------------------------------------------------------- */
const PRIVATE_KEY_B64 = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY_B64) {
    console.error('❌ PRIVATE_KEY not set in .env');
    process.exit(1);
}
/* ------------------- Middleware ------------------- */
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/* ------------------- Routes ------------------- */
// Simple health check
app.get('/', (_, res) => res.send('🔐 Encryption demo server'));
/* Decrypt endpoint */
app.post('/decrypt', async (req, res) => {
    const { ciphertext } = req.body;
    if (!ciphertext) {
        return res.status(400).json({ error: 'Missing ciphertext' });
    }
    try {
        const plaintext = (0, crypto_1.decryptMessage)(ciphertext, PRIVATE_KEY_B64);
        res.json({ plaintext });
    }
    catch (e) {
        console.error('Decryption failed:', e);
        res.status(500).json({ error: 'Failed to decrypt' });
    }
});
/* ------------------- Server bootstrap ------------------- */
(async () => {
    // Ensure libsodium is ready before we start listening
    await (0, crypto_1.initCrypto)();
    app.listen(PORT, async () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
        // Show the public key that clients need
        console.log('Public key (share with client):');
        const sodium = await Promise.resolve().then(() => __importStar(require('libsodium-wrappers')));
        await sodium.ready;
        // Decode the private key (stored as Base‑64)
        const privKey = sodium.from_base64(PRIVATE_KEY_B64, sodium.base64_variants.ORIGINAL);
        // Derive the public key from the private scalar
        const pubKey = sodium.crypto_scalarmult_base(privKey);
        // Print the public key in the same Base‑64 variant
        console.log(sodium.to_base64(pubKey, sodium.base64_variants.ORIGINAL));
    });
})();
