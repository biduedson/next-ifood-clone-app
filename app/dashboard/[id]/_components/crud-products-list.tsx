"use client";
import { Prisma } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import Image from "next/image";
import { formatCurrency } from "@/app/_helpers/price";
import { EditIcon, Loader2, TrashIcon } from "lucide-react";
import ProductEditItemCard from "./product-edit-item-card";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";

interface ICrudProductListProps {
  products: Prisma.ProductGetPayload<{
    include: {
      category: true;
      restaurant: true;
    };
  }>[];
}

const CrudProductsList = ({ products }: ICrudProductListProps) => {
  const [isSubmitLoading, setIsSubmiLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentProducts, setCurrentProducts] = useState(products);
  const deleteProduct = async (id: string) => {
    try {
      const data = await fetch(`/api/product/?id=${id}`, {
        method: "DELETE",
      });
      setIsSubmiLoading(true);
      setCurrentProducts(
        currentProducts.filter((product) => product.id !== id),
      );
      const response = await data.json();

      return response;
    } catch (error) {
      console.log("Erro interno do servidor: ", error);
    } finally {
      setIsSubmiLoading(false);
    }
  };
  return (
    <div className=" overflow-y-autolg:flex  flex w-full flex-wrap items-center justify-center gap-2 bg-[#E5E5E5] lg:flex-col">
      <div className="hidden  w-full lg:block">
        <Table className=" mb-3 ">
          <TableHeader>
            <TableRow>
              <TableHead>Foto do Produto</TableHead>
              <TableHead>Nome do produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Disconto</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow
                key={product.id}
                className="my-2 rounded-sm bg-[#ffffff] "
              >
                <TableCell>
                  <div className="relative h-[60px] w-[60px]  ">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="rounded-sm object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                <TableCell>{product.discountPercentage}%</TableCell>
                <TableCell>{product.description.substring(0, 10)}...</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell className="flex gap-2">
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
                </TableCell>
                <AlertDialog
                  open={isConfirmDialogOpen}
                  onOpenChange={setIsConfirmDialogOpen}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Deseja deletar este produto
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Ao finalizar o produto sera deletado.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setIsConfirmDialogOpen(false)}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteProduct(product.id);
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex min-h-full w-full flex-wrap items-center  gap-2 lg:hidden">
        {currentProducts.map((product) => (
          <ProductEditItemCard
            key={product.id}
            product={product}
            deleteProduct={() => deleteProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CrudProductsList;
