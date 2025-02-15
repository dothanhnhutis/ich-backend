import { CreateDisplayOrder } from "./display.schema";
import DispalyOrderRepositories from "./display.repositories";
import RoomRepositories from "@/modules/v1/room/room.repositories";
import { BadRequestError } from "@/shared/error-handler";

export default class DispalyOrderServices {
  static async createNewDisplayOrder(data: CreateDisplayOrder) {
    for (const roomId of data.roomIds) {
      const roomExists = await RoomRepositories.getRoomById(roomId);
      if (!roomExists)
        throw new BadRequestError(
          `Tạo hiển thị đơn hàng thất bại. Lỗi: Mã phòng roomId=${roomId} không tồn tại.`
        );
    }
    const displayOrder = await DispalyOrderRepositories.createNewDisplayOrder(
      data
    );
    return displayOrder;
  }

  static async getDisplayOrderById(displayOrderId: string) {
    const displayOrder = await DispalyOrderRepositories.getDisplayOrderById(
      displayOrderId
    );

    if (!displayOrder)
      throw new BadRequestError("Hiển thị đơn hàng không tồn tại.");

    return displayOrder;
  }

  static async deleteDisplayOrder(displayOrderId: string) {
    const displayOrder = await DispalyOrderRepositories.getDisplayOrderById(
      displayOrderId
    );

    if (!displayOrder)
      throw new BadRequestError("Hiển thị đơn hàng không tồn tại.");

    await DispalyOrderRepositories.deleteDisplayOrderById(displayOrderId);

    return displayOrder;
  }
}
