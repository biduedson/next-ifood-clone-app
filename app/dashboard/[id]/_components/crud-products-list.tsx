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
import { EditIcon, TrashIcon } from "lucide-react";
import ProductEditItemCard from "./product-edit-item-card";
import _api from "@/app/api/_api";
import { useState } from "react";

interface ICrudProductListProps {
  products: Prisma.ProductGetPayload<{
    include: {
      category: true;
      restaurant: true;
    };
  }>[];
}

const CrudProductsList = ({ products }: ICrudProductListProps) => {
  const [currentProducts, setCurrentProducts] = useState(products);
  const deleteProduct = async (id: string) => {
    const data = await _api.delete(`/product/?id=${id}`);
    setCurrentProducts(currentProducts.filter((product) => product.id !== id));
    return data;
  };
  return (
    <div className=" flex w-full flex-wrap items-center justify-center gap-2 overflow-y-auto bg-[#E5E5E5] lg:flex lg:flex-col">
      <div className="hidden w-full lg:block">
        <Table>
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
                    onClick={() => deleteProduct(product.id)}
                  >
                    <TrashIcon width={20} height={20} />
                    <span className="tex text-sm font-semibold text-red-600">
                      Deletar
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:hidden">
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
