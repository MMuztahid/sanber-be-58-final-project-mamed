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
const mongoose_1 = __importDefault(require("mongoose"));
const mail_1 = __importDefault(require("../utils/mail"));
const user_model_1 = __importDefault(require("../models/user.model"));
const Schema = mongoose_1.default.Schema;
const OrderSchema = new Schema({
    grandTotal: {
        type: Number,
        required: true,
    },
    orderItems: [{
            name: {
                type: String,
                required: true,
            },
            productId: [{
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "Products",
                    required: true,
                }],
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity can not be less than 1"],
                max: [5, "Quantity can not be more than 5"],
            },
        }],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
    }
}, {
    timestamps: true,
});
OrderSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = doc;
        const userData = yield user_model_1.default.findOne({ _id: order.createdBy });
        const content = yield mail_1.default.render('invoices.ejs', {
            customerName: userData === null || userData === void 0 ? void 0 : userData.fullName,
            contactEmail: "muztahid.mohammad@zohomail.com",
            companyName: "sanbercode be batch 58",
            year: 2024,
            orderItems: order.orderItems,
            grandTotal: order === null || order === void 0 ? void 0 : order.grandTotal,
        });
        yield mail_1.default.send({
            to: userData === null || userData === void 0 ? void 0 : userData.email,
            subject: "Order Success",
            content,
        });
        next();
    });
});
const OrderModel = mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;
