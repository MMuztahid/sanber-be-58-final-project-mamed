import mongoose from "mongoose";
import mail from "../utils/mail";
import UserModel from "../models/user.model";

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
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
            type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    statusOrder: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",

    }
  },
  {
    timestamps: true,
  }
);

OrderSchema.post("save", async function (doc, next) {
    const order = doc;
    const userData = await UserModel.findOne({_id: order.createdBy});
    const content = await mail.render('invoices.ejs', {
      customerName: userData?.fullName,
      contactEmail: "muztahid.mohammad@zohomail.com",
      companyName: "sanbercode be batch 58",
      year: 2024,
      orderItems: order.orderItems,
      grandTotal: order?.grandTotal,
    });
  
    await mail.send({
      to: userData?.email,
      subject: "Order Success",
      content,
    });
  
    next();
  });

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;