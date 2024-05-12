import { db } from "../_lib/prisma";
import CategoryItem from "./categoryItem";

const CategoryList = async () => {
  const categories = await db.category.findMany({});
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6 xl:flex xl:items-center xl:justify-center xl:px-36 xl:py-0">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryList;
