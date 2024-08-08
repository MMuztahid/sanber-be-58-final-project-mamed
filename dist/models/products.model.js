"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProductsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less than 1"],
    },
    slug: {
        type: String,
        unique: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Categories",
        require: true,
    },
}, {
    timestamps: true,
});
ProductsSchema.pre("save", function (next) {
    const product = this;
    if (!product.slug) {
        product.slug = product.name.toLowerCase().split(" ").join("-");
    }
    next();
});
const ProductsModel = mongoose_1.default.model("Products", ProductsSchema);
exports.default = ProductsModel;
