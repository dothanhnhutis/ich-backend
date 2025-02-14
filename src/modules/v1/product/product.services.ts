import ProductRepositories from "./product.repositories";
import { CreateProduct } from "./product.schema";

export default class ProductServices {
  static async createNewProduct(data: CreateProduct) {
    return await ProductRepositories.createProduct(data);
  }
}
