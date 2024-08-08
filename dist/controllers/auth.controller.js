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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Yup = __importStar(require("yup"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const encryption_1 = require("../utils/encryption");
const env_1 = require("../utils/env");
const validateRegisterSchema = Yup.object().shape({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match"),
});
const validateLoginSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
});
const validateProfileSchema = Yup.object().shape({
    fullName: Yup.string().required(),
    password: Yup.string().required(),
    passwordConfirmation: Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match"),
    profilePicture: Yup.string(),
});
exports.default = {
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            try {
                yield validateProfileSchema.validate(req.body);
                yield user_model_1.default.updateOne({ _id: userId }, Object.assign({}, req.body));
                const updatedProfile = yield user_model_1.default.findById(userId);
                res.status(200).json({
                    message: "Profile updated successfully",
                    data: updatedProfile,
                });
            }
            catch (error) {
                if (error instanceof Yup.ValidationError) {
                    return res.status(400).send({
                        message: "Validation failed",
                        error: error.errors,
                    });
                }
                const _err = error;
                res.status(500).json({
                    message: "Error updating profile",
                    data: _err.message,
                });
            }
        });
    },
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            try {
                const user = yield user_model_1.default.findById(userId);
                res.status(200).json({
                    message: "User details",
                    data: user,
                });
            }
            catch (error) {
                const _err = error;
                res.status(500).json({
                    message: "Error getting user details",
                    data: _err.message,
                });
            }
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                yield validateLoginSchema.validate({
                    email,
                    password,
                });
                const userByEmail = yield user_model_1.default.findOne({ email });
                if (!userByEmail) {
                    throw new Error("User not found");
                }
                const decryptPassword = (0, encryption_1.decrypt)(env_1.SECRET, userByEmail.password);
                if (password !== decryptPassword) {
                    throw new Error("Email and Password do not match");
                }
                const token = jsonwebtoken_1.default.sign({ id: userByEmail._id, roles: userByEmail.roles }, env_1.SECRET, {
                    expiresIn: "6h",
                });
                res.json({
                    message: "User logged in successfully",
                    data: token,
                });
            }
            catch (error) {
                if (error instanceof Yup.ValidationError) {
                    return res.status(400).send({
                        message: "Validation failed",
                        error: error.errors,
                    });
                }
                const _err = error;
                res.status(500).json({
                    message: "Error logging in user",
                    data: _err.message,
                });
            }
        });
    },
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, username, email, password, roles = ["user"] } = req.body;
            try {
                yield validateRegisterSchema.validate({
                    fullName,
                    username,
                    email,
                    password,
                });
                const user = yield user_model_1.default.create({
                    fullName,
                    username,
                    email,
                    password,
                    roles,
                });
                res.json({
                    message: "User registered successfully",
                    data: user,
                });
            }
            catch (error) {
                if (error instanceof Yup.ValidationError) {
                    return res.status(400).send({
                        message: "Validation failed",
                        error: error.errors,
                    });
                }
                const _err = error;
                res.status(500).json({
                    message: "Error registering user",
                    data: _err.message,
                });
            }
        });
    },
};
