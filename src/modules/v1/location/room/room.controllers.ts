import { Request, Response } from "express";
import { CreateRoomReq, UpdateRoomReq } from "./room.schema";
import { StatusCodes } from "http-status-codes";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";
import RoomServices from "./room.services";

export default class RoomControllers {
  static async getRoomsOfLocation(
    req: Request<{ locationId: string }>,
    res: Response
  ) {
    if (!hasPermission(req.roles!, "read:location:room:*"))
      throw new PermissionError();
    const rooms = await RoomServices.getRoomsOfLocation(req.params.locationId);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message:
        rooms.length == 0
          ? "Không có kết quả nào"
          : `Có ${rooms.length} giá trị từ yêu cầu.`,
      data: rooms,
    });
  }

  static async addRoomToLocation(
    req: Request<CreateRoomReq["params"], {}, CreateRoomReq["body"]>,
    res: Response
  ) {
    const data = req.body;
    if (!hasPermission(req.roles!, "write:location:room"))
      throw new PermissionError();

    const room = await RoomServices.addRoomToLocation(
      req.params.locationId,
      data.room_name
    );
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Tạo phòng thành công",
      data: room,
    });
  }

  static async updateRoomById(
    req: Request<UpdateRoomReq["params"], {}, UpdateRoomReq["body"]>,
    res: Response
  ) {
    const { roomId, locationId } = req.params;
    const data = req.body;
    if (!hasPermission(req.roles!, "edit:location:room"))
      throw new PermissionError();

    const room = await RoomServices.updateRoomById(locationId, roomId, data);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Cập nhật phòng thành công",
      data: room,
    });
  }

  static async deleteRoomById(
    req: Request<{ locationId: string; roomId: string }>,
    res: Response
  ) {
    const { roomId, locationId } = req.params;

    if (!hasPermission(req.roles!, "delete:location:room"))
      throw new PermissionError();

    const room = await RoomServices.deleteRoomOfLocation(locationId, roomId);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Xoá phòng thành công",
      data: room,
    });
  }
}
