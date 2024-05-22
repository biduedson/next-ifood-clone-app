"use client";
import { Restaurant, UserFavoriteRestaurants } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurants } from "../../_actions/search";
import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";

interface IRestaurantsProps {
  userFavoriteRestaurants: UserFavoriteRestaurants[];
}
const Restaurants = ({ userFavoriteRestaurants }: IRestaurantsProps) => {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const searchFor = searchParams.get("search");

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!searchFor) return;
      const foundRestaurants = await searchForRestaurants(searchFor);
      setRestaurants(foundRestaurants);
    };
    fetchRestaurant();
  }, [searchFor]);

  if (!searchFor) {
    return notFound();
  }

  return (
    <>
      <Header isSearch={true} />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">
          {restaurants.length === 0
            ? "Restaurante não encontrado"
            : `Resultados para "${searchFor}"`}
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

export default Restaurants;
