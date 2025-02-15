import OrderProductRepositories from "./order-product.repositories";

export default class DisplayOrderProductServices {
  static async getDisplayOrderProducts(displayOrderId: string) {
    return await OrderProductRepositories.getproductsOfOrderDisplay(
      displayOrderId
    );
  }
}
