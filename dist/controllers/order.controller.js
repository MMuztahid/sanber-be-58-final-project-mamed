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
const order_model_1 = __importDefault(require("../models/order.model"));
const products_model_1 = __importDefault(require("../models/products.model"));
const Yup = __importStar(require("yup"));
const createValidationOrderSchema = Yup.object().shape({
    grandTotal: Yup.number().required(),
    orderItems: Yup.array().of(Yup.object().shape({
        name: Yup.string().required(),
        productId: Yup.string().required(),
        price: Yup.number().required(),
        quantity: Yup.number().required().min(1).max(5).required(),
    })).required(),
    createdBy: Yup.string().required(),
    status: Yup.string().required(),
});
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderItems } = req.body;
                const userId = req.user.id;
                yield createValidationOrderSchema.validate(req.body);
                //pre
                for (const item of orderItems) {
                    const product = yield products_model_1.default.findById(item.productId);
                    if (!product || item.quantity > product.qty) {
                        return res.status(400).json({ message: 'Invalid product or quantity' });
                    }
                    item.name = product.name;
                    item.price = product.price;
                }
                const result = yield order_model_1.default.create({
                    grandTotal: orderItems.reduce((total, item) => total + item.price * item.quantity, 0),
                    orderItems,
                    createdBy: userId,
                    status: "pending"
                });
                res.status(201).json({
                    data: result,
                    message: "Success create order",
                });
                //post
                yield Promise.all(orderItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                    yield products_model_1.default.findByIdAndUpdate(item.productId, { $inc: { qty: -item.quantity } });
                })));
            }
            catch (error) {
                const err = error;
                res.status(500).json({
                    data: err.message,
                    message: "Failed create order",
                });
            }
        });
    },
    findOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { page = 1, limit = 10, } = req.query;
                const result = yield order_model_1.default.find({ createdBy: userId })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('orderItems.productId');
                res.json({
                    data: result,
                    message: "Success get all order",
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching orders' });
            }
        });
    },
};
