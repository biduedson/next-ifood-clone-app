import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function  DELETE(req: Request) {
    try {

        const {searchParams} = new URL(req.url)
        const idProduct = searchParams.get('id')
        const data = await getServerSession(authOptions);

    
    if(req.method !== "DELETE"){
      return NextResponse.json({message: "Metodo incorreto" })  
    }

    //const {id} = req.body;

    if(!idProduct){
        return NextResponse.json({message: "Id não informado" })
    }

    if(!data || !data.user){
        return NextResponse.json({message: "Usuário não autenticado" })
    }


    const restaurantProduct = await db.restaurant.findFirst({
        where: {
            products: {
              some: {
                id:idProduct,
              },
            },
          },
          include: {
            owner: {
              select: {
                id: true,
              },
            },
            products: true, // Inclui os produtos associados ao restaurante, se necessário
          },
    })

    if(!restaurantProduct){
        return NextResponse.json({message: "Não autorizado" } , { status: 401} )
    }

    if(restaurantProduct.ownerId !== data.user.id){
        return NextResponse.json({message: "Não autorizado" } , { status: 401})
    }
       
    const restaurant = await db.restaurant.findFirst({
        where:{
            ownerId:data.user.id
        },
        include:{
            owner:{
                select:{
                    id:true
                }
            }
        }
    })
    
    const idUser = data?.user.id;

    if(!idUser){
        return NextResponse.json({message:"Não autorizado."} , { status: 401 })
    }

    if(!restaurant){
        return NextResponse.json({message:"Não autorizado."} , { status: 401 })
        
    }
    
   
    if(idUser !== restaurant.owner.id){
        return NextResponse.json({message:"Não autorizado."} , { status: 401 })
    }
    
    await db.product.delete({
        where: {
          id: idProduct,
        },
        
      });
      return NextResponse.json({ message: "Produto deletado com sucesso." } , { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno do servidor." });
    }
}

 

