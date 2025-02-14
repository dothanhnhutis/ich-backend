import { Request, Response } from "express";
import { CreateLocationReq, UpdateLocationReq } from "./location.schema";
import LocationServices from "./location.services";
import { StatusCodes } from "http-status-codes";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";

export default class LocationControllers {
  static async getLocations(req: Request, res: Response) {
    if (!hasPermission(req.roles!, "read:location:*"))
      throw new PermissionError();

    const locations = await LocationServices.getLocations();

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message:
        locations.length == 0
          ? "Không có kết quả nào"
          : `Có ${locations.length} giá trị từ yêu cầu.`,
      data: locations,
    });
  }

  static async getLocationById(
    req: Request<{ locationId: string }>,
    res: Response
  ) {
    const { locationId } = req.params;
    if (!hasPermission(req.roles!, "read:location:id"))
      throw new PermissionError();
    const location = await LocationServices.getLocationById(locationId);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Tìm thấy 1 giá trị",
      data: location,
    });
  }

  static async createLocation(
    req: Request<{}, {}, CreateLocationReq["body"]>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "write:location"))
      throw new PermissionError();

    const input = req.body;
    const location = await LocationServices.createLocation(input);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Tạo địa điểm thành công",
      data: location,
    });
  }

  static async updateLocation(
    req: Request<UpdateLocationReq["params"], {}, UpdateLocationReq["body"]>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "edit:location"))
      throw new PermissionError();

    const { locationId } = req.params;
    const data = req.body;

    const location = await LocationServices.updateLocationById(
      locationId,
      data
    );

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Update địa điểm thành công",
      data: location,
    });
  }

  static async deleteLocation(
    req: Request<{ locationId: string }>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "delete:location"))
      throw new PermissionError();

    const { locationId } = req.params;
    const location = await LocationServices.deleteLocationById(locationId);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Xoá địa điểm thành công",
      data: location,
    });
  }
}
