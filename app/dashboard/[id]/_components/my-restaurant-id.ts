

import { getServerSession } from "next-auth";
import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";

export const myrestaurantId = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  const restaurant = await db.restaurant.findFirst({
    where: {
      ownerId: session.user.id,
    },
  });
  
  if (!restaurant) {
    return null; // Retorna nulo se o restaurante não foi encontrado ou a sessão não foi carregada
  }

  
  
  return (
    
   restaurant.id
  );
};


