import { ProductCategoryProps, ProductDocument, ProductProps } from "../models";
export declare class ProductService {
    private static instance?;
    static getInstance(): ProductService;
    private constructor();
    saveProduct(product: Partial<ProductProps>, info: Pick<ProductCategoryProps, 'category'>, platform: string): Promise<ProductDocument>;
}
