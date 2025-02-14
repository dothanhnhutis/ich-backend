import { Request, Response } from "express";
import { CreateProductReq } from "./product.schema";
import { StatusCodes } from "http-status-codes";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";
import ProductServices from "./product.services";

export default class ProductControllers {
  static async getProductById(req: Request, res: Response) {}
  static async getProducts(req: Request, res: Response) {}

  static async createNewProduct(
    req: Request<{}, {}, CreateProductReq["body"]>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "write:product"))
      throw new PermissionError();
    const data = req.body;

    const product = await ProductServices.createNewProduct(data);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Tạo sản phẩm thành công",
      data: product,
    });
  }
  static async updateProductById(req: Request, res: Response) {}
  static async deleteProductById(req: Request, res: Response) {}
}
