import { Prisma } from "@prisma/client";
import ProductItem from "./productItem";

interface ProductListProps {
  products: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>[];
}
const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="flex gap-4 overflow-x-scroll   lg:flex lg:flex-wrap  lg:overflow-x-hidden  [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <div key={product.id} className="flex items-center justify-center">
          <ProductItem key={product.id} product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
