import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";
import { authOptions } from "../_lib/auth";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const RestaurantList = async () => {
  //TODO pegar restaurantes com maior numewro de pedidos
  const session = await getServerSession(authOptions);

  const userFavorites = await db.userFavoriteRestaurants.findMany({
    where: { userId: session?.user?.id },
  });
  const restaurants = await db.restaurant.findMany({
    take: 10,
  });

  return (
    <div className="flex justify-center  ">
      <div className="flex  gap-4 overflow-x-scroll lg:hidden [&::-webkit-scrollbar]:hidden">
        {restaurants.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            restaurant={restaurant}
            userId={session?.user?.id}
            userFavoriteRestaurants={userFavorites}
          />
        ))}
      </div>
      <>
        <Carousel className=" hidden w-full lg:block ">
          <CarouselContent>
            {restaurants.map((restaurant) => (
              <CarouselItem key={restaurant.id} className="lg:basis-1/3 ">
                <RestaurantItem
                  key={restaurant.id}
                  restaurant={restaurant}
                  userId={session?.user?.id}
                  userFavoriteRestaurants={userFavorites}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </>
    </div>
  );
};

export default RestaurantList;
