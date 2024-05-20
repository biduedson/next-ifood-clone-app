import { Prisma } from "@prisma/client";
import ProductItem from "./productItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

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
      <div className="  flex gap-4 overflow-x-scroll lg:w-full lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden">
        {products.slice(0, productsToShow).map((product) => (
          <div key={product.id} className="flex w-full justify-between ">
            <ProductItem key={product.id} product={product} />
          </div>
        ))}
      </div>
      <Carousel className="llg:flex hidden  scroll-smooth ">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              className={`basis-[1/${products.length}]`}
              key={product.id}
            >
              <ProductItem product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default ProductList;
