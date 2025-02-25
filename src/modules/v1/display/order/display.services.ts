import { CreateDisplayOrder } from "./display.schema";
import DispalyOrderRepositories from "./display.repositories";
import { BadRequestError } from "@/shared/error-handler";
import RoomRepositories from "@/modules/v1/location/room/room.repositories";

export default class DispalyOrderServices {
  static async createNewDisplayOrder(data: CreateDisplayOrder) {
    const roomNotExists = await DispalyOrderRepositories.checkRoomNotExists(
      data.room_ids
    );

    if (roomNotExists)
      throw new BadRequestError(
        `Tạo hiển thị đơn hàng thất bại. Lỗi: Mã phòng roomId=${roomNotExists} không tồn tại.`
      );

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

  static async getDisplayOrders() {
    const displayOrder = await DispalyOrderRepositories.getDisplayOrders();
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
