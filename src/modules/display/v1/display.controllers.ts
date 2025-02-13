import { Request, Response } from "express";
import { CreateDisplayOrderReq } from "./display.schema";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";
import { StatusCodes } from "http-status-codes";
import DispalyOrderServices from "./display.services";

export default class DisplayOrderControllers {
  static async createDisplayOrder(
    req: Request<{}, {}, CreateDisplayOrderReq["body"]>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "write:display:order"))
      throw new PermissionError();

    const data = req.body;

    const displayOrder = await DispalyOrderServices.createNewDisplayOrder(data);

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Tạo hiển thị đơn hàng thành công",
      data: displayOrder,
    });
  }
}
