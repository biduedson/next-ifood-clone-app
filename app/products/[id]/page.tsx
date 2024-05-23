import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import ProductImage from "./_components/product-image";
import ProductDetails from "./_components/product-details";
import AddProductToCart from "./_components/add-product-to-cart";
import ProductList from "@/app/_components/productList";
import Header from "@/app/_components/header";
import { Separator } from "@/app/_components/ui/separator";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const quantity = 1;
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) {
    return notFound();
  }
  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product?.restaurant.id,
      },
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <>
      <div className="hidden w-full lg:flex">
        <Header isSearch={true} />
      </div>
      <Separator className="mt-3 hidden lg:flex" />
      <div className="lg:mt-4 lg:px-12 xl:px-24 2xl:px-28">
        <div className="gap-4 lg:flex lg:w-full lg:justify-between ">
          {/*IMAGEM*/}
          <ProductImage product={product} />

          {/* TITULO E PREÇO */}
          <ProductDetails product={product} complementaryProducts={juices} />
        </div>
        <div className="mb-2 mt-6 hidden flex-col space-y-3 px-5 lg:flex lg:px-0">
          <h3 className="font-semibold">Sucos</h3>
          <ProductList products={juices} />
        </div>
        <div className="hidden py-2">
          <AddProductToCart product={product} quantity={quantity} />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
