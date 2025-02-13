import prisma from "@/shared/db/connect";
import { CreateLocation, UpdateLocation } from "./location.schema";
import LocationRepositories from "./location.repositories";
import { BadRequestError, PermissionError } from "@/shared/error-handler";

export default class LocationServices {
  static async getLocations() {
    return await LocationRepositories.getLocations();
  }
  static async createLocation(data: CreateLocation) {
    return await LocationRepositories.createLocation(data);
  }

  static async deleteLocationById(locationId: string) {
    const locationExist = LocationRepositories.getLocationById(locationId);
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");
    const location = await LocationRepositories.deleteLocationById(locationId);
    return location;
  }

  static async updateLocationById(locationId: string, data: UpdateLocation) {
    const locationExist = LocationRepositories.getLocationById(locationId);
    if (!locationExist) throw new BadRequestError("Địa điểm không tồn tại.");
    const location = await LocationRepositories.updateLocationById(
      locationId,
      data
    );
    return location;
  }
}
