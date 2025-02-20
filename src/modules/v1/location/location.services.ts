import { CreateLocation, Room, UpdateLocation } from "./location.schema";
import LocationRepositories from "./location.repositories";
import { BadRequestError } from "@/shared/error-handler";

export default class LocationServices {
  static async getLocations() {
    return await LocationRepositories.getLocations();
  }

  static async getLocationById(locationId: string) {
    const location = await LocationRepositories.getLocationById(locationId);
    if (!location) throw new BadRequestError("Địa điểm không tồn tại");
    return location;
  }

  static async createLocation(data: CreateLocation) {
    const { room_names } = data;
    const uniqueRooms = room_names.filter(
      (room_name, idx, room_names) => room_names.indexOf(room_name) == idx
    );
    if (uniqueRooms.length != room_names.length)
      throw new BadRequestError("Tên các phòng không được giống nhau");
    return await LocationRepositories.createLocation(data);
  }

  static async deleteLocationById(locationId: string) {
    const locationExist = await LocationRepositories.getLocationById(
      locationId
    );
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");

    if (locationExist.rooms.length > 0)
      throw new BadRequestError(
        `Có ${locationExist.rooms.length} phòng đang liên kết với địa điểm này. Hint: Xoá các phòng đang liên kết với địa điểm trước khi xoá.`
      );

    const location = await LocationRepositories.deleteLocationById(locationId);
    return location;
  }

  static async updateLocationById(locationId: string, data: UpdateLocation) {
    const locationExist = await LocationRepositories.getLocationById(
      locationId
    );
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");

    if (data.rooms) {
      const currentRoom: { room_id: string; room_name: string }[] =
        locationExist.rooms.map((room) => ({
          room_id: room.id,
          room_name: room.room_name,
        }));
      for (const room of data.rooms) {
        if ("room_id" in room && "room_name" in room) {
          const roomExist = currentRoom.find(
            (curr) => curr.room_id == room.room_id
          );
          if (!roomExist) throw new BadRequestError("Mã phòng không tồn tại");
          const oldName = currentRoom
            .filter(({ room_id }) => room.room_id != room_id)
            .map(({ room_name }) => room_name);

          if (oldName.includes(room.room_name)) {
            throw new BadRequestError("Tên phòng đã tồn tại");
          }
        } else if ("room_id" in room) {
          const roomExist = currentRoom.find(
            (curr) => curr.room_id == room.room_id
          );
          if (!roomExist) throw new BadRequestError("Mã phòng không tồn tại");
        } else if ("room_name" in room) {
          if (currentRoom.find((room1) => room1.room_name == room.room_name))
            throw new BadRequestError("Tên phòng đã tồn tại");
          currentRoom.push({
            room_id: "",
            room_name: room.room_name,
          });
        }
      }
    }

    const location = await LocationRepositories.updateLocationById(
      locationId,
      data
    );

    return location;
  }
}
