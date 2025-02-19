import LocationRepositories from "@/modules/v1/location/location.repositories";
import RoomRepositories from "./room.repositories";
import { CreateRoom, UpdateRoom } from "./room.schema";
import { BadRequestError } from "@/shared/error-handler";

export default class RoomServices {
  static async getRoomsOfLocation(locationId: string) {
    return await RoomRepositories.getRoomsOfLocation(locationId);
  }

  static async getRoomOfLocation(locationId: string, roomId: string) {
    return await RoomRepositories.getRoomOfLocation(locationId, roomId);
  }

  static async addRoomToLocation(locationId: string, roomName: string) {
    const locationExist = await LocationRepositories.getLocationById(
      locationId
    );
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");
    console.log(locationExist);

    const roomNameExists = locationExist.rooms.find(
      (room) => room.room_name == roomName
    );

    if (roomNameExists)
      throw new BadRequestError(
        `Địa điểm '${locationExist.location_name}' đã có phòng '${roomName}'`
      );

    return await RoomRepositories.addRoomToLocation({
      location_id: locationId,
      room_name: roomName,
    });
  }

  static async updateRoomById(
    locationId: string,
    roomId: string,
    data: UpdateRoom
  ) {
    const locationExist = await LocationRepositories.getLocationById(
      locationId
    );
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");

    const roomExists = await RoomRepositories.getRoomOfLocation(
      locationId,
      roomId
    );
    if (!roomExists) throw new BadRequestError("Phòng không tồn tại.");

    const nameExists = locationExist.rooms
      .filter((room) => room.id != roomId)
      .find((room) => room.room_name == data.room_name);

    if (nameExists) {
      throw new BadRequestError(
        `Địa điểm '${locationExist.location_name}' đã có phòng '${data.room_name}'`
      );
    }

    return await RoomRepositories.updateRoomById(roomId, data);
  }

  static async deleteRoomOfLocation(locationId: string, roomId: string) {
    const roomExists = await RoomRepositories.getRoomOfLocation(
      locationId,
      roomId
    );
    if (!roomExists) throw new BadRequestError("Phòng không tồn tại.");
    return await RoomRepositories.deleteRoomOfLocation(locationId, roomId);
  }
}
