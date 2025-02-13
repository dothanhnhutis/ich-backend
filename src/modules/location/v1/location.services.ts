import { CreateLocation, UpdateLocation } from "./location.schema";
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
    return await LocationRepositories.createLocation(data);
  }

  static async deleteLocationById(locationId: string) {
    const locationExist = await LocationRepositories.getLocationById(
      locationId
    );
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");

    const rooms = await LocationRepositories.getRoomOfLocation(locationId);
    if (rooms.length > 0)
      throw new BadRequestError(
        `Có ${rooms.length} phòng đang liên kết với địa điểm này. Hint: Xoá các phòng đang liên kết với địa điểm trước khi xoá.`
      );

    const location = await LocationRepositories.deleteLocationById(locationId);
    return location;
  }

  static async updateLocationById(locationId: string, data: UpdateLocation) {
    const locationExist = await LocationRepositories.getLocationById(
      locationId
    );
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");

    const location = await LocationRepositories.updateLocationById(
      locationId,
      data
    );
    return location;
  }
}
