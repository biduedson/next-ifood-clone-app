import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";

const RestaurantList = async () => {
  //TODO pegar restaurantes com maior numewro de pedidos
  const restaurants = await db.restaurant.findMany({
    take: 10,
  });
  const limitedRestaurants = restaurants.slice(0, 3);

  return (
    <div className="flex justify-center ">
      <div className="flex  gap-4 overflow-x-scroll lg:hidden [&::-webkit-scrollbar]:hidden">
        {restaurants.map((restaurant) => (
          <RestaurantItem key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
      <div className="hidden w-full  grid-cols-3 lg:grid ">
        {limitedRestaurants.map((restaurant) => (
          <div key={restaurant.id}>
            <RestaurantItem key={restaurant.id} restaurant={restaurant} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
