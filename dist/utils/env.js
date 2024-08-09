"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.DATABASE_URL = exports.CLOUDINARY_CLOUD_NAME = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = void 0;
require('dotenv').config();
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
exports.DATABASE_URL = process.env.DATABASE_URL || "";
exports.SECRET = process.env.SECRET || "secret";
