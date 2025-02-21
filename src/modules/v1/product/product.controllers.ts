import { Request, Response } from "express";
import {
  CreateProductReq,
  UpdateProduct,
  UpdateProductReq,
} from "./product.schema";
import { StatusCodes } from "http-status-codes";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";
import ProductServices from "./product.services";

export default class ProductControllers {
  static async getProductById(
    req: Request<{ productId: string }>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "read:product:id"))
      throw new PermissionError();
    const { productId } = req.params;
    const product = await ProductServices.getProductById(productId);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "",
      data: product,
    });
  }
  static async getProducts(req: Request, res: Response) {
    if (!hasPermission(req.roles!, "read:product:*"))
      throw new PermissionError();
    const products = await ProductServices.getProducts();
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message:
        products.length == 0
          ? "Không có kết quả nào"
          : `Có ${products.length} giá trị từ yêu cầu.`,
      data: products,
    });
  }

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
  static async updateProductById(
    req: Request<UpdateProductReq["params"], {}, UpdateProductReq["body"]>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "edit:product")) throw new PermissionError();
    const { productId } = req.params;
    const data = req.body;

    const product = await ProductServices.updateProductById(productId, data);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  }
  static async deleteProductById(req: Request, res: Response) {
    if (!hasPermission(req.roles!, "delete:product"))
      throw new PermissionError();
    const { productId } = req.params;

    const product = await ProductServices.deleteProductById(productId);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Xoá sản phẩm thành công",
      data: product,
    });
  }
}
