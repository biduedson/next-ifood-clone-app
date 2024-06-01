import Header from "@/app/_components/header";
import { Button } from "@/app/_components/ui/button";
import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import {
  GalleryHorizontal,
  HomeIcon,
  ShoppingBasket,
  UtensilsCrossed,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import CrudProductsList from "./_components/crud-products-list";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";

interface IRestaurantPageProps {
  params: {
    id: string;
  };
}

const MyRestaurantSettings = async ({
  params: { id },
}: IRestaurantPageProps) => {
  const data = await getServerSession(authOptions);

  if (!data?.user) {
    return notFound();
  }

  const [restaurant] = await db.restaurant.findMany({
    where: {
      ownerId: data?.user.id,
    },
    include: {
      categories: true,
      products: {
        include: {
          category: true,
          restaurant: true,
        },
      },
    },
  });

  const categoriesWithProducts = await db.category.findMany({
    where: {
      restaurants: {
        some: {
          id: id, // Substitua `id` pelo ID do restaurante específico que você deseja buscar
        },
      },
    },
    include: {
      products: {
        where: {
          restaurantId: id, // Filtra produtos pelo ID do restaurante específico
        },
        include: {
          category: true,
          restaurant: true,
        },
      },
    },
  });
  if (!restaurant) {
    return (
      <h1 className="px-5 py-6 text-sm font-bold lg:px-12 xl:px-24 2xl:px-28">
        Voce não tem rtestaurante cadastrado.
      </h1>
    );
  }
  return (
    <div className="h-full w-full  flex-col  md:flex md:flex-row  ">
      <div className="w-full md:hidden">
        <Header isSearch={false} />
      </div>

      <div className="mb-2 h-[200px] w-full bg-customRed md:mb-0 md:flex md:h-full md:w-[270px] md:flex-col md:items-center">
        <div className="  flex flex-col items-center">
          <h1 className="my-2 text-sm font-semibold text-white">Dashboard</h1>
        </div>
        <div className="relative m-2  hidden h-[50px] w-[50px] rounded-full md:mt-12  md:flex md:h-[100px] md:w-[100px]">
          <Image
            src={restaurant?.imageUrl!}
            alt={restaurant?.name!}
            fill
            className="absolute left-1 top-1 rounded-full object-cover shadow-md "
          />
        </div>

        <div className=" flex flex-col items-center">
          <h1 className="py-2 text-sm font-semibold text-white">
            {restaurant.name}
          </h1>
          <span className="font-sm text-[12px] text-[#FEAF00]">
            Administração
          </span>
        </div>
        <div className="grid h-auto grid-cols-2 gap-1 md:flex md:w-[193px] md:flex-col md:space-y-4 md:pt-12">
          <Button className="flex h-[41px] w-full justify-start gap-1  rounded-[4px]  pl-12 text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <HomeIcon width={16} hanging={16} />
            Home
          </Button>
          <Button className="flex h-[41px] w-full justify-start  gap-1  rounded-[4px] pl-12 text-start text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <ShoppingBasket width={16} hanging={16} />
            Produtos
          </Button>
          <Button className="flex h-[41px] w-full justify-start gap-1 rounded-[4px] pl-12 text-start text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <GalleryHorizontal width={16} hanging={16} />
            Categorias
          </Button>
          <Button className="flex h-[41px] w-full justify-start  gap-1 rounded-[4px] pl-12 text-start text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <UtensilsCrossed width={16} hanging={16} />
            Restaurante
          </Button>
        </div>
      </div>

      <div className="min-h-full w-full overflow-y-scroll  [&::-webkit-scrollbar]:hidden  ">
        <div className="hidden w-full md:flex">
          <Header isSearch={false} />
        </div>
        <Tabs
          defaultValue="account"
          className="item center flex w-full flex-col "
        >
          <TabsList className="flex  h-[50px]  w-full gap-2 bg-[#E5E5E5] px-3 md:px-0">
            <h1 className="text-sm font-semibold text-black">
              Selecione a categoria.
            </h1>
            {categoriesWithProducts.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.name}
                className="rounded-[5px] bg-customRed text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categoriesWithProducts.map((category) => (
            <TabsContent
              key={category.id}
              value={category.name}
              className=" h-full"
            >
              <div className="min-h-full w-full bg-[#E5E5E5] px-3 ">
                <div className="flex w-full justify-between py-4 ">
                  <h1 className="text-sm font-bold">Produtos</h1>
                  <Button className="rounded-[4px] bg-customRed hover:bg-[#FEAF00] hover:text-black">
                    Adicinar Produto
                  </Button>
                </div>
                <CrudProductsList products={category.products} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MyRestaurantSettings;
