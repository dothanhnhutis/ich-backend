import { Request, Response } from "express";
import { CreateLocationReq, UpdateLocationReq } from "./location.schema";
import LocationServices from "./location.services";
import { StatusCodes } from "http-status-codes";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";

export default class LocationControllers {
  static async getLocations(req: Request, res: Response) {
    if (!hasPermission(req.roles!, "read:location"))
      throw new PermissionError();

    const locations = await LocationServices.getLocations();
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "",
      data: locations,
    });
  }

  static async createLocation(
    req: Request<{}, {}, CreateLocationReq["body"]>,
    res: Response
  ) {
    const input = req.body;
    const location = await LocationServices.createLocation(input);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Tạo địa điểm thành công",
      data: location,
    });
  }

  static async updateLocation(
    req: Request<UpdateLocationReq["params"], {}, UpdateLocationReq["body"]>,
    res: Response
  ) {
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
