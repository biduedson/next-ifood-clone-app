import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import { db } from "../_lib/prisma";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../_components/ui/carousel";

const MyFavoriteRestaurants = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  const userFavoriterestaurants = await db.userFavoriteRestaurants.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      restaurant: true,
    },
  });
  return (
    <>
      <Header isSearch={true} />
      <div className="px-5 py-6 lg:px-12 xl:px-24 2xl:px-28">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Favoritos</h2>
        <div className="flex w-full flex-col gap-6 lg:hidden">
          {userFavoriterestaurants.length > 0 ? (
            userFavoriterestaurants.map(
              (
                { restaurant }, //restaurant sendo desestruturado do userFavoriterestaurants
              ) => (
                <RestaurantItem
                  key={restaurant.id}
                  restaurant={restaurant}
                  userFavoriteRestaurants={userFavoriterestaurants}
                  className="min-w-full max-w-full"
                />
              ),
            )
          ) : (
            <h1 className="text-sm font-medium">
              Você ainda não marcou nenhum restaurante como favorito.
            </h1>
          )}
        </div>

        {userFavoriterestaurants.length > 0 && (
          <Carousel className=" hidden   lg:block ">
            <CarouselContent>
              {userFavoriterestaurants.map(({ restaurant }) => (
                <CarouselItem key={restaurant.id} className="lg:basis-1/3 ">
                  <RestaurantItem
                    key={restaurant.id}
                    restaurant={restaurant}
                    userId={session?.user?.id}
                    userFavoriteRestaurants={userFavoriterestaurants}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </>
  );
};

export default MyFavoriteRestaurants;
