"use client";

import { Suspense } from "react";
import Restaurants from "./[id]/_components/restaurants";

const RestaurantsPage = () => {
  return (
    <Suspense>
      <Restaurants />;
    </Suspense>
  );
};

export default RestaurantsPage;
