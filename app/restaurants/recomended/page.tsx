import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
import { Separator } from "@/app/_components/ui/separator";
import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";

const RecomendedRestaurants = async () => {
  const session = await getServerSession(authOptions);
  const userFavoriteRestaurants = await db.userFavoriteRestaurants.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      restaurant: true,
    },
  });
  const restaurants = await db.restaurant.findMany({});
  return (
    <>
      <div className="hidden w-full lg:flex">
        <Header isSearch={true} />
      </div>
      <Separator className="mt-3 hidden lg:flex" />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">
          Restaurantes Recomendados
        </h2>
        <div className="flex w-full flex-col gap-6 ">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className="min-w-full max-w-full"
              userFavoriteRestaurants={userFavoriteRestaurants}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecomendedRestaurants;
