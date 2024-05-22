"use client";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import React, { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";

interface ISearchProps {
  YellowButton?: boolean;
}

const Search = ({ YellowButton }: ISearchProps) => {
  console.log(YellowButton);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearcSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!search) {
      return;
    }

    router.push(`/restaurants?search=${search}`);
  };
  return (
    <form className="flex gap-2" onSubmit={handleSearcSubmit}>
      <Input
        placeholder="Buscar Restaurantes"
        className="border-none  md:w-[350px]  lg:w-[500px]"
        onChange={handleChange}
        value={search}
      />
      <Button size="icon" type="submit" className="z-50">
        <SearchIcon size={18} />
      </Button>
    </form>
  );
};

export default Search;
