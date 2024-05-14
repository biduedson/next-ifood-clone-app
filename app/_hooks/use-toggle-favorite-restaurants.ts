import { toast } from "sonner";
import { toggleFavoriteRestaurant } from "../_actions/restaurant";
import { UserFavoriteRestaurants } from "@prisma/client";
import { useRouter } from "next/navigation";


interface IUseToggleFavoriteRestaurantProps{
    userId?: string;
    userFavoriteRestaurants?: UserFavoriteRestaurants[];
    restaurantId: string;
    restaurantIsCurrentlyFavorite:boolean;
}

const useToggleFavoriteRestaurants = ({
    userId,
    restaurantId,
    restaurantIsCurrentlyFavorite
}:IUseToggleFavoriteRestaurantProps) => {
    const router = useRouter()

    const handleFavoriteClick = async () => {
        if(!userId) return
    
        try {
          await toggleFavoriteRestaurant(userId, restaurantId);
    
          toast(
           restaurantIsCurrentlyFavorite
           ? "Restaurante removido dos seus favoritos."
           : "Restaurante adicionado aos seus favoritos.",
            {
              action: {
                label: "Ver Favoritos",
                onClick: () => router.push("/my-favorite-restaurants"),
              },
            },
          );
        } catch (error) {
          toast.error("Erro ao favoritar restaurante.");
        }
      };
    
      return { handleFavoriteClick };
    };
    
export default useToggleFavoriteRestaurants;