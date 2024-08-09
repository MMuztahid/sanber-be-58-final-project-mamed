"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
require('dotenv').config();
const transporter = nodemailer_1.default.createTransport({
    service: "Zoho",
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
    },
    requireTLS: true,
});
const send = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, content, }) {
    const result = yield transporter.sendMail({
        from: "muztahid.mohammad@zohomail.com",
        to,
        subject,
        html: content,
    });
    return result;
});
const render = (template, data) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield ejs_1.default.renderFile(path_1.default.join(__dirname, `templates/${template}`), data);
    return content;
});
exports.default = {
    send,
    render,
};
