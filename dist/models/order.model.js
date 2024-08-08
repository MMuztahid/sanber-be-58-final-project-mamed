"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
const OrderModel = mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;
