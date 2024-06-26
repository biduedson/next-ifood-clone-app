"use client";
import { Button } from "@/app/_components/ui/button";
import { Product } from "@prisma/client";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductImageProps {
  product: Pick<Product, "name" | "imageUrl">;
}

const ProductImage = ({ product }: ProductImageProps) => {
  const router = useRouter();

  const handleBackclick = () => router.back();
  return (
    <div className="relative h-[368px] w-full lg:h-[500px] lg:w-[600px] xl:h-[480px] xl:w-[700px]">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        className="object-cover lg:rounded-[10px]"
      />

      <Button
        className="absolute left-2 top-2 rounded-full bg-white text-foreground hover:text-white"
        size="icon"
        onClick={handleBackclick}
      >
        <ChevronLeftIcon />
      </Button>
    </div>
  );
};

export default ProductImage;
