import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  return (
    <Link
      href={`/categories/${category.id}/products`}
      className="flex  items-center justify-center gap-3 rounded-full bg-white px-4 py-3 shadow-md lg:h-[54px] lg:w-[152px] lg:px-3 lg:py-4"
    >
      <Image
        src={category.imageUrl}
        alt={category.name}
        height={30}
        width={30}
        className="lg:hidden"
      />
      <Image
        src={category.imageUrl}
        alt={category.name}
        height={24}
        width={24}
        className="hidden lg:block"
      />
      <span className="text-sm font-semibold lg:text-xs">{category.name}</span>
    </Link>
  );
};

export default CategoryItem;
