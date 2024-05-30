import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(){
    const data = await getServerSession(authOptions);

    if(!data){
        return NextResponse.json({message: "Usuário não autenticado." }, {status: 401})
    }
    const [idRestaurant] = await db.restaurant.findMany({
        where: {
          ownerId: data.user.id,
        },
        select:{
            id:true
        }
        
      });

      if(!idRestaurant){
        return NextResponse.json({message: "Restaurante não encontrado." }, {status: 401})
    }



    const dataRestaurant = await db.restaurant.findFirst({
        where: {
            ownerId: data.user.id,
          },
          include: {
            categories: {
              include: {
                products: {
                  where: {
                    restaurantId: {
                      equals: idRestaurant.id  // Use o ID do restaurante aqui
                    },
                  },
                },
              },
            },
          },
        });
      if(!dataRestaurant){
        return NextResponse.json({message: "Restaurante não encontrado." }, {status:404})
      }

     return NextResponse.json(dataRestaurant)
}