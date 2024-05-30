import Header from "@/app/_components/header";
import { Button } from "@/app/_components/ui/button";
import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { HomeIcon } from "lucide-react";
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
        Você ainda não incluiu nenhum restaurante como favorito.
      </h1>
    );
  }
  return (
    <div className="flex h-full w-full ">
      <div className="flex w-[270px] flex-col items-center bg-customRed">
        <div className=" my-2 flex flex-col items-center">
          <h1 className="text-sm font-semibold text-white">Administração</h1>
        </div>
        <div className="relative  mt-12 h-[100px] w-[100px] rounded-full">
          <Image
            src={restaurant?.imageUrl!}
            alt={restaurant?.name!}
            fill
            className="rounded-full object-cover shadow-md "
          />
        </div>
        <div className=" flex flex-col items-center">
          <h1 className="py-2 text-sm font-semibold text-white">
            {restaurant.name}
          </h1>
          <span className="text-[10px] font-light text-[#FEAF00]">
            Administrador
          </span>
        </div>
        <div className="h-auto w-[193px] space-y-4 pt-12">
          <Button className="flex h-[41px] w-full justify-start gap-1  rounded-[4px]  pl-12 text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <HomeIcon width={16} hanging={16} />
            Home
          </Button>
          <Button className="flex h-[41px] w-full justify-start  gap-1  rounded-[4px] pl-12 text-start text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <HomeIcon width={16} hanging={16} />
            Produtos
          </Button>
          <Button className="flex h-[41px] w-full justify-start gap-1 rounded-[4px] pl-12 text-start text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <HomeIcon width={16} hanging={16} />
            Categorias
          </Button>
          <Button className="flex h-[41px] w-full justify-start  gap-1 rounded-[4px] pl-12 text-start text-xs font-bold  hover:bg-[#FEAF00] hover:text-[black]">
            <HomeIcon width={16} hanging={16} />
            Restaurante
          </Button>
        </div>
      </div>

      <div className="min-h-full w-full overflow-y-scroll  [&::-webkit-scrollbar]:hidden  ">
        <Header isSearch={false} />
        <Tabs
          defaultValue="account"
          className="item center flex w-full flex-col "
        >
          <TabsList className="flex w-full gap-2 bg-[#E5E5E5]">
            <h1 className="text-sm font-semibold">
              Selecione a categoria de produtos.
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
              className="w-full "
            >
              <div className="min-h-full w-full bg-[#E5E5E5] px-3">
                <div className="flex w-full justify-between py-4">
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
