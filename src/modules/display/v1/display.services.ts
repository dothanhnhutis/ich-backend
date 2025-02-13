import { CreateDisplayOrder } from "./display.schema";
import DispalyOrderRepositories from "./display.repositories";

export default class DispalyOrderServices {
  static async createNewDisplayOrder(data: CreateDisplayOrder) {
    const displayOrder = await DispalyOrderRepositories.createNewDisplayOrder(
      data
    );

    return displayOrder;
  }
}
