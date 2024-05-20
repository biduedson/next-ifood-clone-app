import CategoryList from "./_components/categoryList";
import Header from "./_components/header";
import Search from "./_components/search";
import ProductList from "./_components/productList";
import { Button } from "./_components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { db } from "./_lib/prisma";
import PromoBanner from "./_components/promo-banner";
import RestaurantList from "./_components/restaurant-list";
import Link from "next/link";
import getConfig from "next/config";

const fetch = async () => {
  const getProducts = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  const getBurguersCategory = db.category.findFirst({
    where: {
      name: "Hambúrgueres",
    },
  });

  const getPizzasCategory = db.category.findFirst({
    where: {
      name: "Pizzas",
    },
  });

  const [products, burguersCategory, pizzasCategory] = await Promise.all([
    getProducts,
    getBurguersCategory,
    getPizzasCategory,
  ]);

  return { products, burguersCategory, pizzasCategory };
};

const Home = async () => {
  const { products, burguersCategory, pizzasCategory } = await fetch();
  const { serverRuntimeConfig } = getConfig();

  if (serverRuntimeConfig.decimalWarning === false) {
    console.warn = () => {};
  }
  return (
    <>
      <Header />

      <div className="px-5">
        <div className="px-5 pt-6">
          <Search />
        </div>

        <div className=" lg:space-y-6 lg:px-12 xl:px-24 2xl:px-28">
          <div className="pt-6">
            <CategoryList />
          </div>

          <div className=" pt-6 lg:hidden">
            <Link href={`/categories/${pizzasCategory?.id}/products`}>
              <PromoBanner
                src="/promo-banner-01.png"
                alt="Até 30% de desconto em pizzas!"
              />
            </Link>
          </div>

          <div className="space-y-4 pt-6 lg:justify-center ">
            <div className="flex w-full items-center justify-between  lg:px-0">
              <h2 className="font-semibold">Pedidos Recomendados</h2>

              <Button
                variant="ghost"
                className="h-fit p-0 text-primary hover:bg-transparent"
                asChild //as child esta opçãp do shadcn vai pegar toda configuração do css e jogar para o elemento filho  no caso ai o link
              >
                <Link href="/products/recomended">
                  Ver todos
                  <ChevronRightIcon size={16} />
                </Link>
              </Button>
            </div>
            <ProductList products={products} />
          </div>

          <div className="hidden w-full  justify-between gap-8  lg:flex  ">
            <div className="w-full">
              <Link href={`/categories/${pizzasCategory?.id}/products`}>
                <PromoBanner
                  src="/promo-banner-01.png"
                  alt="Até 30% de desconto em pizzas!"
                />
              </Link>
            </div>

            <div className="w-full">
              <Link href={`/categories/${burguersCategory?.id}/products`}>
                <PromoBanner
                  src="/promo-banner-02.png"
                  alt="A partir de 17,90 em lanches"
                />
              </Link>
            </div>
          </div>

          <div className=" pt-6 lg:hidden">
            <Link href={`/categories/${burguersCategory?.id}/products`}>
              <PromoBanner
                src="/promo-banner-02.png"
                alt="A partir de 17,90 em lanches"
              />
            </Link>
          </div>

          <div className=" items-center space-y-4 pt-6 ">
            <div className="flex items-center justify-between  lg:px-0">
              <h2 className="font-semibold">Restaurantes Recomendados</h2>

              <Button
                variant="ghost"
                className="h-fit p-0 text-primary hover:bg-transparent"
                asChild
              >
                <Link href="/restaurants/recomended">
                  Ver todos
                  <ChevronRightIcon size={16} />
                </Link>
              </Button>
            </div>

            <RestaurantList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
