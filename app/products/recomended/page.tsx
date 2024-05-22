import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/productItem";
import { Separator } from "@/app/_components/ui/separator";
import { db } from "@/app/_lib/prisma";

const RecomendeProductsPage = async () => {
  //TODO: pegar futuramente produtos com mais pedidos
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 20,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });
  return (
    <>
      <div className="hidden w-full lg:flex">
        <Header isSearch={true} />
      </div>
      <Separator className="mt-3 hidden lg:flex" />
      <div className="px-5 py-6 lg:px-12 xl:px-24 2xl:px-28">
        <h2 className="mb-6 text-lg font-semibold">Pedidos Recomendados</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="min-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecomendeProductsPage;
