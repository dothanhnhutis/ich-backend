import { Request, Response } from "express";
import { CreateDisplayOrderReq } from "./display.schema";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";
import { StatusCodes } from "http-status-codes";
import DisplayOrderServices from "./display.services";

export default class DisplayOrderControllers {
  static async getDisplayOrderById(
    req: Request<{ displayOrderId: string }>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "read:display:order:id"))
      throw new PermissionError();

    const displayOrder = await DisplayOrderServices.getDisplayOrderById(
      req.params.displayOrderId
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Có 1 kết quả trả về",
      data: displayOrder,
    });
  }

  static async createDisplayOrder(
    req: Request<{}, {}, CreateDisplayOrderReq["body"]>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "write:display:order"))
      throw new PermissionError();
    const data = req.body;
    const displayOrder = await DisplayOrderServices.createNewDisplayOrder(data);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Tạo hiển thị đơn hàng thành công",
      data: displayOrder,
    });
  }

  static async deleteDisplayOrder(
    req: Request<{ displayOrderId: string }>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "delete:display:order"))
      throw new PermissionError();

    const displayOrder = await DisplayOrderServices.deleteDisplayOrder(
      req.params.displayOrderId
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Tạo hiển thị đơn hàng thành công",
      data: displayOrder,
    });
  }
}
