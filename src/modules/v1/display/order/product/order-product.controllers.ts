import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import DisplayOrderProductServices from "./order-product.services";

export default class DisplayOrderProductControllers {
  static async getDisplayOrderProducts(
    req: Request<{ displayOrderId: string }>,
    res: Response
  ) {
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
}
