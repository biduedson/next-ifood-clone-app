"use client";
import Image from "next/image";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import DiscountBadge from "@/app/_components/discount-badge";
import { Prisma } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useContext, useState } from "react";
import ProductList from "@/app/_components/productList";
import Deliveryinfo from "@/app/_components/delivery-info";
import { CartContext } from "@/app/_context/cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import Cart from "@/app/_components/cart";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;

  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isCArtOpen, setIsCartOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { addProductToCArt, products } = useContext(CartContext);

  const handleAddToCartClick = () => {
    addProductToCArt(product, quantity);
    setIsCartOpen(true);
  };

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);

  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) => {
      if (currentState === 1) return 1;
      return currentState - 1;
    });

  return (
    <>
      <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
        {/* RESTAURANTE */}
        <div className="flex items-center gap-[0.375rem] px-5">
          <div className="relative h-6 w-6">
            <Image
              src={product.restaurant.imageUrl}
              alt={product.restaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {product.restaurant.name}
          </span>
        </div>

        {/* NOME DO PRODUTO */}
        <h1 className="mb-2 mt-1 px-5 text-xl font-semibold">{product.name}</h1>

        {/* PREÇO DO PRODUTO E QUANTIDADE */}
        <div className="flex justify-between px-5">
          {/* PREÇO COM DESCONTO  */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {formatCurrency(calculateProductTotalPrice(product))}
              </h2>
              {product.discountPercentage > 0 && (
                <DiscountBadge product={product} />
              )}
            </div>

            {/* PREÇO ORIGINAL */}
            {product.discountPercentage > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(Number(product.price))}
              </p>
            )}
          </div>

          {/* QUANTIDADE */}

          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="border border-solid border-muted-foreground "
              onClick={handleDecreaseQuantityClick}
            >
              <ChevronLeftIcon />
            </Button>
            <span className="w-4">{quantity}</span>
            <Button size="icon" onClick={handleIncreaseQuantityClick}>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
        {/* DADOS DA ENTREGA */}

        <div className="px-5">
          <Deliveryinfo restaurant={product.restaurant} />
        </div>

        <div className="mt-6 space-y-3 px-5">
          <h3 className="font-semibold">Sobre</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="mt-6 space-y-3 px-5">
          <h3 className="font-semibold">Sucos</h3>
          <ProductList products={complementaryProducts} />
        </div>

        <div className="mt-6 px-5">
          <Button
            className="w-full font-semibold"
            onClick={handleAddToCartClick}
          >
            Adicionar a sacola
          </Button>
        </div>
      </div>

      <Sheet open={isCArtOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[90vw]">
          <SheetHeader>
            <SheetTitle className="text-left">Sacola</SheetTitle>
          </SheetHeader>
          <Cart />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductDetails;
