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
  const productsToShow = Math.min(products.length, 6);
  return (
    <>
      <div className="  flex gap-4 overflow-x-scroll px-5 lg:w-full lg:overflow-x-hidden lg:px-0 [&::-webkit-scrollbar]:hidden">
        {products.slice(0, productsToShow).map((product) => (
          <div key={product.id} className="flex w-full justify-between  ">
            <ProductItem key={product.id} product={product} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
