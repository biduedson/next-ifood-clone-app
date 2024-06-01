"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  HeartIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LoaderIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Search from "./search";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IHeaderProps {
  isSearch: boolean;
}

const Header = ({ isSearch }: IHeaderProps) => {
  const { data } = useSession();
  const [idRestaurant, setIdRestaurant] = useState<string | null | undefined>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const handleSignOutClick = () => {
    signOut().then(() => {
      router.replace("/");
    });
  };
  const handleSignInClick = () => signIn();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const openCloseDialog = () => {
    setIsConfirmDialogOpen(!isConfirmDialogOpen);
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (data?.user?.id) {
        try {
          console.log("Fetching restaurant ID...");
          const response = await fetch("/api/myRestaurantId");
          const result = await response.json();
          if (result) {
            console.log("Restaurant ID fetched:", result);
            setIdRestaurant(result);
          } else {
            console.log("No restaurant ID found.");
          }
        } catch (error) {
          console.error("Failed to fetch restaurant ID:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [data]);

  return (
    <>
      <div className="flex w-full justify-between px-5 pt-6 lg:h-[80px] lg:items-center  lg:px-12 xl:px-24 2xl:px-28 ">
        <div className="relative h-[30px] w-[100px]">
          <Link href="/">
            {/* No image do next/link sempre que uso fill ela vai ocupar 100% da imagem ta tag pai dele desde que esta esteja como relative*/}
            <Image
              src="/Logo.png"
              alt="Fsw Foods"
              fill
              className="object-cover"
            />
          </Link>
        </div>

        {isSearch && (
          <div className="hidden md:flex md:w-[350px] lg:w-[600px]">
            <Search />
          </div>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="border-none bg-transparent"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            {data?.user ? (
              <>
                <div className="flex justify-between pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={data?.user.image as string | undefined}
                      />
                      <AvatarFallback>
                        {data?.user?.name?.split(" ")[0][0]}
                        {data?.user?.name?.split(" ")[1][0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className=" font-semibold">{data?.user?.name}</h3>
                      <span className=" block text-xs text-muted-foreground">
                        {data?.user?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between pt-10">
                  <h2 className="font-semibold"> Olá. Faça seu Login</h2>
                  <Button size="icon" onClick={handleSignInClick}>
                    <LogInIcon />
                  </Button>
                </div>
              </>
            )}

            <div className="py-6">
              <Separator />
            </div>

            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
              >
                <Link href="/" className="flex space-x-3">
                  <HomeIcon size={16} />
                  <span className="block">Inicio</span>
                </Link>
              </Button>

              {data?.user && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                    asChild //para aplicar os stilos acima ao link e não criar uma nova tag <a>
                  >
                    <Link href="/my-orders">
                      <ScrollTextIcon size={16} />
                      <span className="block">Meus Pedidos</span>
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                    asChild
                  >
                    <Link href="/my-favorite-restaurants">
                      <HeartIcon size={16} />
                      <span className="block">Restaurantes Favoritos</span>
                    </Link>
                  </Button>

                  {loading ? (
                    <div className="flex ">
                      <span className="flex w-full justify-start gap-1 space-x-3 rounded-full text-sm font-normal ">
                        <LoaderIcon className="animate-spin" />
                        Loading..
                      </span>
                    </div>
                  ) : idRestaurant ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                      asChild
                    >
                      <Link href={`/dashboard/${idRestaurant}`}>
                        <LayoutDashboardIcon size={16} />
                        <span className="block">Meu Restaurante</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                      asChild
                    >
                      <Link href="/">
                        <LayoutDashboardIcon size={16} />
                        <span className="block">Cadastre Seu restaurante</span>
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="py-6">
              <Separator />
            </div>
            {data?.user && (
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                onClick={openCloseDialog}
              >
                <LogOutIcon size={16} />
                <span className="block">Sair da Conta</span>
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </div>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent className="lg:flex lg:h-[179px] lg:w-[318px] lg:flex-col lg:items-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Sair da conta
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Deseja mesmo sair da plataforma
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={openCloseDialog}
              className="lg:h-[45px] lg:w-[133px]"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOutClick}
              className="lg:h-[45px] lg:w-[133px]"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;
