import { BadRequestError } from "@/shared/error-handler";
import DisplayOrderRepositories from "../display.repositories";
import OrderProductRepositories from "./order-product.repositories";
import {
  CreateDisplayOrderProduct,
  UpdateDisplayOrderProduct,
} from "./order-product.schema";

export default class DisplayOrderProductServices {
  static async getDisplayOrderProducts(displayOrderId: string) {
    return await OrderProductRepositories.getproductsOfOrderDisplay(
      displayOrderId
    );
  }

  static async addProductToDisplayOrder(
    displayOrderId: string,
    product: CreateDisplayOrderProduct
  ) {
    const displayOrder = await DisplayOrderRepositories.getDisplayOrderById(
      displayOrderId
    );

    if (!displayOrder)
      throw new BadRequestError(
        "Thêm sản phẩm vào hiển thị đơn hàng không thành công. Lỗi: Mã hiển thị đơn hàng không tồn tại."
      );

    return await OrderProductRepositories.addProductToOrderDisplay(
      displayOrderId,
      product
    );
  }

  static async updateProductOfDisplayOrder(
    displayOrderId: string,
    productId: string,
    data: UpdateDisplayOrderProduct
  ) {
    const displayOrder = await DisplayOrderRepositories.getDisplayOrderById(
      displayOrderId
    );

    if (!displayOrder)
      throw new BadRequestError(
        "Cập nhât sản phẩm trong hiển thị đơn hàng không thành công. Lỗi: Mã hiển thị đơn hàng không tồn tại."
      );

    const hasExist = displayOrder.products.find(
      (product) => product.id == productId
    );

    if (!hasExist)
      throw new BadRequestError(
        "Cập nhât sản phẩm trong hiển thị đơn hàng không thành công. Lỗi: Mã sản phẩm không tồn tại."
      );

    return await OrderProductRepositories.updateProductOfOrderDisplay(
      productId,
      data
    );
  }

  static async removeProductToDisplayOrder(
    displayOrderId: string,
    productId: string
  ) {
    const displayOrder = await DisplayOrderRepositories.getDisplayOrderById(
      displayOrderId
    );

    if (!displayOrder)
      throw new BadRequestError(
        "Xoá sản phẩm trong hiển thị đơn hàng không thành công. Lỗi: Mã hiển thị đơn hàng không tồn tại."
      );

    const hasExist = displayOrder.products.find(
      (product) => product.id == productId
    );

    if (!hasExist)
      throw new BadRequestError(
        "Xoá sản phẩm trong hiển thị đơn hàng không thành công. Lỗi: Mã sản phẩm không tồn tại."
      );

    return await OrderProductRepositories.removeProductToOrderDisplay(
      displayOrderId,
      productId
    );
  }
}
