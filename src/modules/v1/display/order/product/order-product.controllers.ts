import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import DisplayOrderProductServices from "./order-product.services";
import {
  CreateDisplayOrderProductReq,
  UpdateDisplayOrderProductReq,
} from "./order-product.schema";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";

export default class DisplayOrderProductControllers {
  static async getDisplayOrderProducts(
    req: Request<{ displayOrderId: string }>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "read:display:order:*"))
      throw new PermissionError();
    const displayOrderProducts =
      await DisplayOrderProductServices.getDisplayOrderProducts(
        req.params.displayOrderId
      );
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message:
        displayOrderProducts.length == 0
          ? "Không có kết quả nào"
          : `Có ${displayOrderProducts.length} giá trị từ yêu cầu.`,
      data: displayOrderProducts,
    });
  }

  static async addProductToDisplayOrder(
    req: Request<
      CreateDisplayOrderProductReq["params"],
      {},
      CreateDisplayOrderProductReq["body"]
    >,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "write:display:order:product"))
      throw new PermissionError();

    const { displayOrderId } = req.params;
    const data = req.body;

    const displayOrderProduct =
      await DisplayOrderProductServices.addProductToDisplayOrder(
        displayOrderId,
        data
      );
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Thêm sản phẩm vào hiển thị đơn hàng thành công",
      data: displayOrderProduct,
    });
  }

  static async updateProductOfDisplayOrder(
    req: Request<
      UpdateDisplayOrderProductReq["params"],
      {},
      UpdateDisplayOrderProductReq["body"]
    >,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "edit:display:order:product"))
      throw new PermissionError();
    const { displayOrderId, productId } = req.params;
    const data = req.body;

    const product =
      await DisplayOrderProductServices.updateProductOfDisplayOrder(
        displayOrderId,
        productId,
        data
      );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  }

  static async removeProductToDisplayOrder(
    req: Request<{ displayOrderId: string; productId: string }>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "delete:display:order:product"))
      throw new PermissionError();

    const { displayOrderId, productId } = req.params;

    const displayOrderProduct =
      await DisplayOrderProductServices.removeProductToDisplayOrder(
        displayOrderId,
        productId
      );
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Xoá sản phẩm vào hiển thị đơn hàng thành công",
      data: displayOrderProduct,
    });
  }
}
