import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import { db } from "../_lib/prisma";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";
import { Separator } from "../_components/ui/separator";

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
      <Separator className="mt-3 hidden lg:flex" />

      {userFavoriterestaurants.length > 0 ? (
        <div className="px-5 py-6 lg:px-12 xl:px-24 2xl:px-28">
          <h2 className="mb-6 text-lg font-semibold">Restaurantes favoritos</h2>
          <div className="flex w-full flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 ">
            {userFavoriterestaurants.map((restaurant) => (
              <RestaurantItem
                key={restaurant.restaurant.id}
                restaurant={restaurant.restaurant}
                className="min-w-full max-w-full"
                userFavoriteRestaurants={userFavoriterestaurants}
              />
            ))}
          </div>
        </div>
      ) : (
        <h1 className="px-5 py-6 text-sm font-bold lg:px-12 xl:px-24 2xl:px-28">
          Você ainda não incluiu nehum restaurante como favorito.
        </h1>
      )}
    </>
  );
};

export default MyFavoriteRestaurants;
