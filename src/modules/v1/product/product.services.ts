import { BadRequestError } from "@/shared/error-handler";
import ProductRepositories from "./product.repositories";
import { CreateProduct, UpdateProduct } from "./product.schema";

export default class ProductServices {
  static async createNewProduct(data: CreateProduct) {
    return await ProductRepositories.createNewProduct(data);
  }

  static async updateProductById(productId: string, data: UpdateProduct) {
    const product = await ProductRepositories.getProductById(productId);
    if (!product) throw new BadRequestError("Sản phẩm không tồn tại");

    return await ProductRepositories.updateProductById(productId, data);
  }

  static async getProductById(productId: string) {
    const product = await ProductRepositories.getProductById(productId);
    if (!product) throw new BadRequestError("Sản phẩm không tồn tại");
    return product;
  }

  static async deleteProductById(productId: string) {
    const product = await ProductRepositories.getProductById(productId);
    if (!product) throw new BadRequestError("Sản phẩm không tồn tại");
    await ProductRepositories.deleteProductById(productId);
    return product;
  }
}
