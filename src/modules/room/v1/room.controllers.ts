import { Request, Response } from "express";
import { CreateRoomReq, UpdateRoomReq } from "./room.schema";
import { StatusCodes } from "http-status-codes";
import hasPermission from "@/shared/hasPermission";
import { PermissionError } from "@/shared/error-handler";
import RoomServices from "./room.services";

export default class RoomControllers {
  static async getRooms(req: Request, res: Response) {
    if (!hasPermission(req.roles!, "read:room:*")) throw new PermissionError();
    const rooms = await RoomServices.getRooms();

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

  static async getRoomById(req: Request<{ roomId: string }>, res: Response) {
    const { roomId } = req.params;
    if (!hasPermission(req.roles!, "read:room:id")) throw new PermissionError();
    const room = await RoomServices.getRoomById(roomId);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Tìm thấy 1 giá trị",
      data: room,
    });
  }

  static async createNewRoom(
    req: Request<{}, {}, CreateRoomReq["body"]>,
    res: Response
  ) {
    const data = req.body;
    if (!hasPermission(req.roles!, "write:room")) throw new PermissionError();
    const room = await RoomServices.createNewRoom(data);
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
    const { roomId } = req.params;
    const data = req.body;
    if (!hasPermission(req.roles!, "edit:room")) throw new PermissionError();

    const room = await RoomServices.updateRoomById(roomId, data);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Cập nhật phòng thành công",
      data: room,
    });
  }

  static async deleteRoomById(req: Request<{ roomId: string }>, res: Response) {
    const { roomId } = req.params;

    if (!hasPermission(req.roles!, "delete:room")) throw new PermissionError();

    const room = await RoomServices.deleteRoomById(roomId);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Xoá phòng thành công",
      data: room,
    });
  }
}
