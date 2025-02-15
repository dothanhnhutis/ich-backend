import LocationRepositories from "@/modules/v1/location/location.repositories";
import RoomRepositories from "./room.repositories";
import { CreateRoom, UpdateRoom } from "./room.schema";
import { BadRequestError } from "@/shared/error-handler";

export default class RoomServices {
  static async getRooms() {
    return await RoomRepositories.getRooms();
  }

  static async getRoomById(roomId: string) {
    const roomExists = await RoomRepositories.getRoomById(roomId);
    if (!roomExists) throw new BadRequestError("Phòng không tồn tại");
    return roomExists;
  }

  static async createNewRoom(data: CreateRoom) {
    const locationExist = await LocationRepositories.getLocationById(
      data.location_id
    );
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");

    const room = await RoomRepositories.getUniqueData(data);
    if (room)
      throw new BadRequestError(
        `Địa điểm '${room.location.location_name}' đã có phòng '${room.room_name}'`
      );
    return await RoomRepositories.createNewRoom(data);
  }

  static async updateRoomById(roomId: string, data: UpdateRoom) {
    const roomExists = await RoomRepositories.getRoomById(roomId);
    if (!roomExists) throw new BadRequestError("Phòng không tồn tại.");

    const newData: CreateRoom = {
      room_name: roomExists.room_name,
      location_id: roomExists.location_id,
      ...data,
    };

    const room = await RoomRepositories.getUniqueData(newData);
    if (room) {
      if (room.id != roomExists.id) {
        throw new BadRequestError(
          `Địa điểm '${room.location.location_name}' đã có phòng '${room.room_name}'`
        );
      } else {
        return roomExists;
      }
    }

    return await RoomRepositories.updateRoomById(roomId, data);
  }

  static async deleteRoomById(roomId: string) {
    const roomExists = await RoomRepositories.getRoomById(roomId);
    if (!roomExists) throw new BadRequestError("Phòng không tồn tại.");
    return await RoomRepositories.deleteRoomById(roomId);
  }
}
