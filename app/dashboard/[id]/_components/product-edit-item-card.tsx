"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import { ArrowDownIcon, EditIcon, Loader2, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface IProductEditItemCardProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
      category: true;
    };
  }>;
  deleteProduct: () => void;
}

const ProductEditItemCard = ({
  product,
  deleteProduct,
}: IProductEditItemCardProps) => {
  const [isSubmitLoading, setIsSubmiLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  return (
    <div className="w-[170px] space-y-2 py-2 ">
      <div className="relative aspect-square w-full lg:w-[135px] xl:w-[155px]  2xl:w-[180px]">
        {/* IMAGEN*/}
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="rounded-lg object-cover shadow-md"
        />

        {product.discountPercentage && (
          <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-primary px-2 py-[2px] text-white">
            <ArrowDownIcon size={12} />
            <span className="text-semibold text-xs">
              {product.discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* TITULO, PREÇO E RESTAURANTE*/}
      <div>
        <h2 className="truncate text-sm">{product.name}</h2>
        <div className="flex items-center gap-1">
          <h3 className="font-semibold">
            {formatCurrency(calculateProductTotalPrice(product))}
          </h3>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(Number(product.price))}
            </span>
          )}
        </div>

        <span className="block text-xs text-muted-foreground">
          {product.restaurant.name}
        </span>
      </div>
      <div className="flex w-full justify-between gap-2">
        <div className="flex cursor-pointer flex-col items-center">
          <EditIcon width={20} height={20} />
          <span className="tex text-sm font-semibold text-yellow-500">
            Editar
          </span>
        </div>
        <div
          className="flex cursor-pointer flex-col items-center"
          onClick={() => setIsConfirmDialogOpen(true)}
        >
          <TrashIcon width={20} height={20} />
          <span className="tex text-sm font-semibold text-red-600">
            Deletar
          </span>
        </div>
      </div>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja deletar este produto</AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar o produto sera deletado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConfirmDialogOpen}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsSubmiLoading(true);
                deleteProduct();
                setIsSubmiLoading(false);
              }}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductEditItemCard;
