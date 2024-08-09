"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encrypt = (key, plainText) => {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};
exports.encrypt = encrypt;
const decrypt = (key, plainText) => {
    const textParts = plainText.split(":");
    const ivHex = textParts.shift();
    const iv = ivHex ? Buffer.from(ivHex, "hex") : Buffer.alloc(0);
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
exports.decrypt = decrypt;
