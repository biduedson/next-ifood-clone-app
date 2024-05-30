import { formatCurrency } from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import { DeleteIcon, EditIcon } from "lucide-react";
import Image from "next/image";

interface ICrudProductsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      category: true;
    };
  }>;
}
const CrudProduct = ({ product }: ICrudProductsProps) => {
  return (
    <>
      <tr className="flex min-w-full items-center rounded-sm bg-[#ffffff]  py-2">
        <td className="flex items-center gap-4 ">
          <div className="flex w-[150px] items-center px-4 ">
            <div className="relative h-[60px] w-[60px] ">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="rounded-sm object-cover"
              />
            </div>
          </div>
        </td>
        <td className="w-[150px]   py-3 text-left text-xs font-medium">
          {product.name}
        </td>
        <td className="w-[150px]   py-3 text-left text-xs font-medium">
          {formatCurrency(Number(product.price))}
        </td>
        <td className="w-[150px]  py-3 text-left text-xs font-medium ">
          {product.discountPercentage}%
        </td>
        <td className=" w-[150px] py-3 text-left text-xs font-medium ">
          {product.description.substring(0, 10)}...
        </td>
        <td className="w-[150px] py-3 text-left text-xs font-medium">
          {product.category.name}
        </td>
        <td className="flex w-[150px] gap-4 py-3 text-left text-xs font-medium">
          <div className="flex cursor-pointer flex-col items-center">
            <EditIcon width={20} height={20} />
            <span className="tex text-sm font-semibold text-yellow-500">
              Editar
            </span>
          </div>
          <div className="flex cursor-pointer flex-col items-center">
            <DeleteIcon width={20} height={20} />
            <span className="tex text-sm font-semibold text-red-600">
              Deletar
            </span>
          </div>
        </td>
      </tr>
    </>
  );
};

export default CrudProduct;
