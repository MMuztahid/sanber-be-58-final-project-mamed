import { Request, Response } from "express";
import OrderModel from "../models/order.model";
import ProductsModel from "../models/products.model";
import * as Yup from 'yup';
import { IReqUser } from "../utils/interfaces";

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

  interface IPaginationQuery {
    page: number;
    limit: number;
    search?: string;
  }

export default {
    async create(req: Request, res: Response) {
        try {
            const { grandTotal, orderItems, createdBy, status } = req.body;
            await createValidationOrderSchema.validate(req.body);
            //pre
            for (const item of orderItems) {
                const product = await ProductsModel.findById(item.productId);
                if (!product || item.quantity > product.qty ) {
                    return res.status(400).json({ message: 'Invalid product or quantity' });
                }
                item.name = product.name;
                item.price = product.price;
            }
            const result = await OrderModel.create(req.body);
            res.status(201).json({
            data: result,
            message: "Success create order",
          });
          
          //post
          await Promise.all(
            orderItems.map(async (item:any) => {
              await ProductsModel.findByIdAndUpdate(item.productId, { $inc: { qty: -item.quantity } });
            })
          );

        } catch (error) {
          const err = error as Error;
          res.status(500).json({
            data: err.message,
            message: "Failed create order",
          });
        }
      },

      async findOrder(req: Request, res: Response) {
        try {
          const userId = (req as IReqUser).user.id;
          const {
            page = 1,
            limit = 10,
          } = req.query as unknown as IPaginationQuery;
      
          const result = await OrderModel.find({ createdBy: userId })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('orderItems.productId');
      
          res.json({
            data: result,
            message: "Success get all order",
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error fetching orders' });
        }
      },
};