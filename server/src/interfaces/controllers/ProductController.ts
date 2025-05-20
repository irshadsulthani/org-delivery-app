// src/infrastructure/controllers/ProductController.ts
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../../utils/statusCode";
import { ProductRepository } from "../../infrastructure/database/repositories/ProductRepository";
import { AddProductDto } from "../../domain/dtos/AddProductDto";
import { AddProductUseCase } from "../../application/use-cases/product/AddProductUseCase";
import { GetProductDetailsUseCase } from "../../application/use-cases/product/GetProductDetailsUseCase";
import { GetRetailerProudctUseCase } from "../../application/use-cases/product/GetRetailerProudctUseCase";
import { GetAllProductsUseCase } from "../../application/use-cases/product/GetAllProductsUseCase";
import { UpdateProductDto } from "../../domain/dtos/UpdateProductDto";
import { UpdateProductUseCase } from "../../application/use-cases/product/UpdateProductUseCase";

export class ProductController {
  private static productRepository = new ProductRepository();

  static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const retailerId = (req.user as any).id;

      if (!req.files || !("images" in req.files)) {
        res.status(StatusCode.BAD_REQUEST).json({
          message: "Product images are required",
        });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const images = files["images"];

      const dto: AddProductDto = {
        retailerId,
        name: req.body.name,
        category: req.body.category,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity),
        description: req.body.description,
        unit: req.body.unit,
        images,
      };

      const useCase = new AddProductUseCase(ProductController.productRepository);
      const product = await useCase.execute(dto);

      res.status(StatusCode.CREATED).json({
        success: true,
        message: "Product added successfully",
        data: product,
      });
    } catch (error: any) {
      console.error("Error adding product:", error);
      next(error);
    }
  }

  static async getRetailerProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const retailerId = (req.user as any).id;
      const useCase = new GetRetailerProudctUseCase(
        ProductController.productRepository
      );
      const products = await useCase.execute(retailerId);
      res.status(StatusCode.OK).json({
        success: true,
        data: products
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getProductDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      if (!productId) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Product ID is required",
        });
        return;
      }

      const useCase = new GetProductDetailsUseCase(
        ProductController.productRepository
      );
      const product = await useCase.execute(productId);
      if (!product) {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      console.error("Error fetching product details:", error);
      next(error);
    }
  }

  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = new GetAllProductsUseCase(ProductController.productRepository);
      const products = await useCase.execute();
      
      res.status(StatusCode.OK).json({
        success: true,
        data: products
      });
    } catch (error: any) {
      console.error("Error fetching products:", error);
      next(error);
    }
  }
static async updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const retailerId = (req.user as any).id;
    const { productId } = req.params;
    if (!productId) {
      return res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Prepare DTO
    const dto: UpdateProductDto = {
      productId,
      retailerId,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      quantity: req.body.quantity ? parseInt(req.body.quantity) : undefined,
      description: req.body.description,
      unit: req.body.unit,
      existingImages: [],
      newImages: []
    };

    // Handle existing images
    if (req.body.existingImages) {
      try {
        dto.existingImages = typeof req.body.existingImages === 'string' 
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
        
        // Ensure it's always an array
        if (!Array.isArray(dto.existingImages)) {
          dto.existingImages = [];
        }
      } catch (error) {
        console.warn('Failed to parse existingImages, defaulting to empty array');
        dto.existingImages = [];
      }
    }
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        dto.newImages = files;
      }
    }

    const useCase = new UpdateProductUseCase(ProductController.productRepository);
    const updatedProduct = await useCase.execute(dto);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    next(error);
  }
}

}

// import { Request, Response } from "express";
// import { ProductRepository } from "../../infrastructure/database/repositories/ProductRepository";

// import { StatusCode } from "../../utils/statusCode";

// const productRepository = new ProductRepository();

// export class ProductController {
//   static async addProduct(req: Request, res: Response): Promise<void> {
//     try {

//     } catch (error: any) {
//       res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
//         message: "Failed to add product",
//         error: error.message,
//       });
//     }
//   }

// //   static async getProducts(req: Request, res: Response): Promise<void> {
// //     try {
// //       if (!req.user || typeof req.user === "string") {
// //         res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
// //         return;
// //       }

// //       const products = await productRepository.getProductsByRetailer(
// //         req.user._id
// //       );
// //       res.status(StatusCode.OK).json(products);
// //     } catch (error: any) {
// //       res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
// //         message: "Failed to fetch products",
// //         error: error.message,
// //       });
// //     }
// //   }

// //   static async getProduct(req: Request, res: Response): Promise<void> {
// //     try {
// //       const product = await productRepository.getProductById(req.params.id);
// //       if (!product) {
// //         res.status(StatusCode.NOT_FOUND).json({ message: "Product not found" });
// //         return;
// //       }
// //       res.status(StatusCode.OK).json(product);
// //     } catch (error: any) {
// //       res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
// //         message: "Failed to fetch product",
// //         error: error.message,
// //       });
// //     }
// //   }

//   static async updateProduct(req: Request, res: Response): Promise<void> {
//     try {
//       const updatedProduct = await productRepository.updateProduct(
//         req.params.id,
//         req.body
//       );
//       if (!updatedProduct) {
//         res.status(StatusCode.NOT_FOUND).json({ message: "Product not found" });
//         return;
//       }
//       res.status(StatusCode.OK).json(updatedProduct);
//     } catch (error: any) {
//       res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
//         message: "Failed to update product",
//         error: error.message,
//       });
//     }
//   }

//   static async deleteProduct(req: Request, res: Response): Promise<void> {
//     try {
//       const success = await productRepository.deleteProduct(req.params.id);
//       if (!success) {
//         res.status(StatusCode.NOT_FOUND).json({ message: "Product not found" });
//         return;
//       }
//       res
//         .status(StatusCode.OK)
//         .json({ message: "Product deleted successfully" });
//     } catch (error: any) {
//       res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
//         message: "Failed to delete product",
//         error: error.message,
//       });
//     }
//   }
// }
